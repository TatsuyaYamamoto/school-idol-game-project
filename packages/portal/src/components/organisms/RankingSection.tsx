import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { IndexRange } from "react-virtualized";

import RankingList from "../molecules/RankingList";
import LastUpdateTime from "../molecules/LastUpdateTime";
import { Member } from "../../utils/tmp_mikan";
import { functionsOrigin } from "../../utils/firebase";

const ListWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
`;

interface RankingSectionProps {
  game: string;
}

const RankingSection: FC<RankingSectionProps> = (props) => {
  const [virtualState, setVirtualState] = useState<{
    game: string;
    hasMoreItem: boolean;
    rankingList: {
      rank: number;
      userName: string;
      point: number;
      member: Member;
    }[];
    lastVisibleId: string | null;
    lastUpdatedAt: Date;
  }>({
    game: props.game,
    hasMoreItem: true,
    rankingList: [],
    lastVisibleId: null,
    lastUpdatedAt: new Date(),
  });

  const loadMoreItem = async ({}: IndexRange) => {
    const { game, lastVisibleId } = virtualState;

    const search = new URLSearchParams();
    if (lastVisibleId) {
      search.set("lastVisibleId", lastVisibleId);
    }
    const res = await fetch(
      `${functionsOrigin}/api/games/${game}/ranking?${search}`
    );
    const { scores, updatedAt } = await res.json();

    if (scores.length === 0) {
      console.log("no more scores");
      setVirtualState((prev) => ({ ...prev, hasMoreItem: false }));
      return;
    }

    setVirtualState((prev) => {
      if (game !== prev.game) {
        console.log(
          `the fetched game (${game}) and the current props game (${prev.game}) are different. ignore this game ranking list push.`
        );
        return prev;
      }

      const pushedItems = prev.rankingList;
      scores.forEach((score: any) => {
        pushedItems.push({
          rank: score.rank,
          userName: score.userName,
          point: score.point,
          member: score.member,
        });
      });

      return {
        ...prev,
        game,
        rankingList: pushedItems,
        lastVisibleId: scores[scores.length - 1].id,
        lastUpdatedAt: new Date(updatedAt),
      };
    });
  };

  useEffect(() => {
    setVirtualState({
      game: props.game,
      hasMoreItem: true,
      rankingList: [],
      lastVisibleId: null,
      lastUpdatedAt: new Date(),
    });
  }, [props.game]);

  return (
    <>
      <LastUpdateTime time={virtualState.lastUpdatedAt} />
      <ListWrapper>
        <RankingList
          hasMoreItem={virtualState.hasMoreItem}
          list={virtualState.rankingList}
          loadMoreItem={loadMoreItem}
        />
      </ListWrapper>
    </>
  );
};

export default RankingSection;
