import * as React from "react";
import styled from "styled-components";
import { MEMBERS, Member, getMemberIcon } from "@sokontokoro/mikan";
// @ts-ignore
import Tippy from "@tippy.js/react";

interface Props {
  rank: number;
  point: number;
  userName: string;
  member: Member;
}

const margin = 10;
const Root = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  padding: 0.2em 0.5em;
  margin: ${margin}px;
  color: #565656;
  background: rgba(255, 222, 222, 0.27);
  box-shadow: 0 0 0 ${margin}px #ffeaea;
  border: dashed 2px #ffc3c3;
  border-radius: 8px;
`;

const Rank = styled.div``;

const RankValue = styled.span`
  font-size: 25px;
`;

const RankUnit = styled.span`
  font-size: 15px;
`;

const UserDetail = styled.div``;

const Username = styled.div``;

const Score = styled.div``;

const ScoreLabel = styled.span``;

const ScoreValue = styled.span``;

const memberBudgeSize = 30;

const Member = styled.div`
  font-size: ${memberBudgeSize}px;

  padding: 0.2em 0.5em;
  color: #565656;
  background: white;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  //border: dashed 2px #ffc3c3;
  border-radius: ${memberBudgeSize}px;
`;

/**
 * TODO: i18n
 * @param props
 * @constructor
 */
const RankItem: React.SFC<Props> = (props) => {
  const { rank, point, userName, member } = props;

  const tooltip = `${MEMBERS[member].name.ja}とプレイしました！`;

  return (
    <Root>
      <Rank>
        <RankValue>{rank}</RankValue>
        <RankUnit>位</RankUnit>
      </Rank>
      <UserDetail>
        <Username>{userName}</Username>
        <Score>
          <ScoreLabel>{"SCORE "}</ScoreLabel>
          <ScoreValue>{point}</ScoreValue>
        </Score>
      </UserDetail>
      <Tippy content={tooltip} arrow={true} duration={500} delay={[100, 50]}>
        <Member>{`${getMemberIcon(member)}`}</Member>
      </Tippy>
    </Root>
  );
};

export default RankItem;
