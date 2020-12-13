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

import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import { NewUserForm } from "./form/NewUserForm";

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
    @Body() form: NewUserForm
  ): Promise<any> {
    const { uid, debug } = form;
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

    return this.userService.create(uid, debug);
  }
}
