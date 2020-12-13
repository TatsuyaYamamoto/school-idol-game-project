import { Module } from "@nestjs/common";

import { UserController } from "./controller/user/user.controller";
import { AuthService } from "./service/auth.service";
import { UserService } from "./service/user.service";

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class AppModule {}
