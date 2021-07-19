import { Controller, Get, Query, Param } from "@nestjs/common";

import type { Member } from "@sokontokoro/mikan";

import { GameService } from "../../service/game.service";

@Controller("games")
export class GameController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly gameService: GameService) {}

  @Get(":game/ranking")
  async getRanking(
    @Param("game") game: string,
    @Query("lastVisibleId") lastVisibleId?: string
  ): Promise<{
    scores: {
      id: string;
      uid: string;
      userName: string;
      member: Member;
      rank: number;
      point: number;
    }[];
    updatedAt: Date;
  }> {
    return this.gameService.getRanking(game, lastVisibleId);
  }
}
