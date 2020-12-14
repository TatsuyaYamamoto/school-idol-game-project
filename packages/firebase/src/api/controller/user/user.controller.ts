import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

import { LinkUserForm } from "./form/LinkUserForm";

import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import { NewUserForm } from "./form/NewUserForm";

import {
  sendToSlackAsNewUserNotif,
  sendToSlackAsLinkedUserNotif,
} from "../../../helper/slack";
import { getDocUrl } from "../../../utils";

@Controller("users")
export class UserController {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Get(":uid")
  async getUser(@Param("uid") uid: string): Promise<any> {
    const user = await this.userService.getById(uid);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Post("new")
  async newUser(
    @Headers("authorization") authorizationHeader: string,
    @Headers("X-Skntkr-Source") xSkntkrSource: string,
    @Body() form: NewUserForm
  ): Promise<any> {
    const { uid } = form;
    const idToken = authorizationHeader?.replace("Bearer ", "");

    if (!idToken) {
      throw new UnauthorizedException();
    }

    let decodedToken;
    try {
      decodedToken = await this.authService.verifyIdToken(idToken);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    if (uid !== decodedToken.uid) {
      throw new BadRequestException();
    }

    const created = await this.userService.create(uid);
    const userDocUrl = getDocUrl("users", uid);

    sendToSlackAsNewUserNotif({
      uid,
      userDocUrl,
      xSkntkrSource,
    });

    return created;
  }

  @Post(":uid/link")
  public async linkUser(
    @Headers("authorization") authorizationHeader: string,
    @Headers("X-Skntkr-Source") xSkntkrSource: string,
    @Param("uid") uid: string,
    @Body() form: LinkUserForm
  ): Promise<any> {
    const idToken = authorizationHeader?.replace("Bearer ", "");

    if (!idToken) {
      throw new UnauthorizedException();
    }

    let decodedToken;
    try {
      decodedToken = await this.authService.verifyIdToken(idToken);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    if (uid !== decodedToken.uid) {
      throw new BadRequestException();
    }

    const linked = await this.userService.link({
      uid,
      duplicatedUid: form.duplicatedUid,
      provider: {
        id: form.provider.id,
        userId: form.provider.userId,
        displayName: form.provider.displayName,
        photoUrl: form.provider.photoUrl,
        accessToken: form.provider.accessToken,
        secret: form.provider.secret,
      },
    });

    const userDocUrl = getDocUrl("users", uid);
    sendToSlackAsLinkedUserNotif({
      uid,
      displayName: linked.displayName,
      userDocUrl,
      xSkntkrSource,
    });

    return linked;
  }
}
