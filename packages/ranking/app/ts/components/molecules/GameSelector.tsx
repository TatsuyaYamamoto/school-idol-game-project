import * as React from "react";
import { default as Slider, Settings, CustomArrowProps } from "react-slick";
import AutoBind from "autobind-decorator";

import styled from "styled-components";
import Arrow from "../atoms/GameSelectArrow";
import GameSelectorItem from "./GameSelectorItem";

interface Props {
  list: {
    imageUrl: string;
    title: string;
  }[];
  initialIndex: number;
  slickSettings: Settings;
  onSelected: (index: number) => void;
}

const Root = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
`;

const NextArrow: React.SFC<CustomArrowProps> = props => {
  return (
    <Arrow
      className={props.className}
      style={{ ...props.style }}
      onClick={props.onClick}
    />
  );
};

const PrevArrow: React.SFC<CustomArrowProps> = props => {
  return (
    <Arrow
      className={props.className}
      style={{ ...props.style }}
      onClick={props.onClick}
    />
  );
};

@AutoBind
class GameSelector extends React.Component<Props> {
  private slickRef = React.createRef<Slider>();
  private pendingIdOfOnSelected: any = null;

  // TODO {@link https://github.com/akiran/react-slick/pull/1272}
  private beforeIndex: number = 0;

  componentDidMount() {
    this.beforeIndex = this.props.initialIndex;
  }

  render() {
    const { list, initialIndex, slickSettings } = this.props;

    const settings: Settings = {
      infinite: false,
      initialSlide: initialIndex,
      dots: true,
      arrows: true,
      beforeChange: this.beforeChange,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      ...slickSettings
    };

    return (
      <Root>
        <Slider ref={this.slickRef} {...settings}>
          {list.map(item => (
            <GameSelectorItem
              key={item.title}
              title={item.title}
              imageUrl={item.imageUrl}
            />
          ))}
        </Slider>
      </Root>
    );
  }

  private beforeChange(current: number, next: number) {
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
  }
}

export default GameSelector;
