import * as React from "react";
import Slider, { Settings, CustomArrowProps } from "react-slick";
import styled from "styled-components";

import { GAMES, Game } from "../../utils/tmp_mikan";

import Arrow from "../atoms/GameSelectArrow";
import GameSelectorItem from "./GameSelectorItem";

const Root = styled.div`
  max-width: 500px;
  margin: 0px auto;
  padding: 30px;
`;

const NextArrow: React.SFC<CustomArrowProps> = (props) => {
  return (
    <Arrow
      className={props.className}
      style={{ ...props.style }}
      onClick={props.onClick}
    />
  );
};

const PrevArrow: React.SFC<CustomArrowProps> = (props) => {
  return (
    <Arrow
      className={props.className}
      style={{ ...props.style }}
      onClick={props.onClick}
    />
  );
};

interface Props {
  game: Game;
  slickSettings: Settings;
  onSelected: (index: number) => void;
}

interface State {
  initialSelectorIndex: number;
  games: Game[];
}

class GameSelector extends React.Component<Props, State> {
  private slickRef = React.createRef<Slider>();
  private pendingIdOfOnSelected: any = null;

  // TODO {@link https://github.com/akiran/react-slick/pull/1272}
  private beforeIndex: number = 0;

  constructor(props: any) {
    super(props);

    const { game } = this.props;

    // TODO support ranking system yamidori, oimo!
    const games: Game[] = ["honocar", "shakarin", "maruten"];

    this.state = {
      games,
      initialSelectorIndex: Object.keys(GAMES).findIndex((id) => id === game),
    };
  }

  render() {
    const { slickSettings } = this.props;
    const { initialSelectorIndex } = this.state;

    const settings: Settings = {
      infinite: false,
      initialSlide: initialSelectorIndex,
      dots: true,
      arrows: true,
      beforeChange: this.beforeChange,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      ...slickSettings,
    };

    // TODO support ranking system yamidori, oimo!
    const games: Game[] = ["honocar", "shakarin", "maruten"];

    return (
      <Root>
        <Slider ref={this.slickRef} {...settings}>
          {games.map((game) => (
            <GameSelectorItem
              key={GAMES[game].url}
              title={GAMES[game].name.ja} // TODO support multi language.
              imageUrl={GAMES[game].imageUrl}
            />
          ))}
        </Slider>
      </Root>
    );
  }

  private beforeChange = (current: number, next: number) => {
    if (this.beforeIndex === next) {
      return;
    }

    this.beforeIndex = next;

    if (this.pendingIdOfOnSelected) {
      clearTimeout(this.pendingIdOfOnSelected);
    }

    this.pendingIdOfOnSelected = setTimeout(() => {
      this.props.onSelected(next);
    }, 500);
  };
}

export default GameSelector;
