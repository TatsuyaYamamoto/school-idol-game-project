import { FC } from "react";
import styled from "styled-components";

import Title from "../atoms/GameTitle";
import GameImage from "../atoms/GameImage";

interface GameSelectorItemProps {
  title: string;
  imageUrl: string;
}

const Root = styled.div`
  text-align: center;
`;

const GameSelectorItem: FC<GameSelectorItemProps> = (props) => {
  const { title, imageUrl } = props;

  return (
    <Root>
      <GameImage src={imageUrl} />
      <Title>{title}</Title>
    </Root>
  );
};

export default GameSelectorItem;
