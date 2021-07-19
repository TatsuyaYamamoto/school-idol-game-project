import { Module } from "@nestjs/common";

import { UserController } from "./controller/user/user.controller";
import { GameController } from "./controller/game/game.controller";
import { AuthService } from "./service/auth.service";
import { GameService } from "./service/game.service";
import { UserService } from "./service/user.service";

@Module({
  controllers: [UserController, GameController],
  providers: [UserService, AuthService, GameService],
})
export class AppModule {}
