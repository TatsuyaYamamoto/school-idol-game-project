import * as React from "react";

interface Props {
  rank: number;
  point: number;
  userName: string;
}

const RankItem: React.SFC<Props> = props => {
  const { rank, point, userName } = props;
  return (
    <div>
      <div>Rank: {rank}</div>
      <div>Point: {point}</div>
      <div>User: {userName}</div>
    </div>
  );
};

export default RankItem;
