import * as React from "react";
import { default as Slider, Settings, CustomArrowProps } from "react-slick";
import styled from "styled-components";
import Arrow from "../atoms/GameSelectArrow";
import Title from "../atoms/GameTitle";
import GameImage from "../atoms/GameImage";

interface Props {
  title: string;
  imageUrl: string;
}

const Root = styled.div`
  text-align: center;
`;

const GameSelectorItem: React.SFC<Props> = props => {
  const { title, imageUrl } = props;

  return (
    <Root>
      <GameImage src={imageUrl} />
      <Title>{title}</Title>
    </Root>
  );
};

export default GameSelectorItem;
