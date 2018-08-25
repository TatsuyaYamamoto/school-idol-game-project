import OverState, { EnterParams as AbstractEnterParams } from "./OverState";

import PlayerWins from "../../../../texture/containers/GameResultPaper/PlayerWins";

export interface EnterParams extends AbstractEnterParams {
  onePlayerWins: number;
  twoPlayerWins: number;
}

class OnlineOverState extends OverState {
  onEnter(params: EnterParams): void {
    super.onEnter(params);

    const { winner, onePlayerWins, twoPlayerWins } = params;

    const onePlayerWinsText = new PlayerWins(1, onePlayerWins);
    onePlayerWinsText.position.set(
      -1 * this.resultPaper.width * 0.25,
      -1 * this.resultPaper.height * 0.3
    );

    const twoPlayerWinsText = new PlayerWins(2, twoPlayerWins);
    twoPlayerWinsText.position.set(
      this.resultPaper.width * 0.25,
      -1 * this.resultPaper.height * 0.3
    );

    this.resultPaper.addChild(onePlayerWinsText, twoPlayerWinsText);

    this.backGroundLayer.addChild(this.background);

    this.applicationLayer.addChild(
      this.restartButton,
      this.backToTopButton,
      this.resultPaper,
      this.gameOverLogo
    );
  }
}

export default OnlineOverState;
