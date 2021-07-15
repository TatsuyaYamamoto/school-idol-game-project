import React from "react";
import { IndexRange } from "react-virtualized";

import RankingList from "../molecules/RankingList";
import RankItem from "../molecules/RankItem";
import LastUpdateTime from "../molecules/LastUpdateTime";

interface Props {
  game: string;
}

interface State {
  hasMoreItem: boolean;
  game: string;
  rankingList: JSX.Element[];
  lastVisibleId: string | null;
  lastUpdatedAt: Date;
}

export default class RankingSection extends React.Component<Props, State> {
  public constructor(props: any) {
    super(props);

    this.state = {
      game: this.props.game,
      hasMoreItem: true,
      rankingList: [],
      lastVisibleId: null,
      lastUpdatedAt: new Date(),
    };
  }

  public static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.game !== prevState.game) {
      console.log(`change game. ${prevState.game} -> ${nextProps.game}`);

      return {
        game: nextProps.game,
        hasMoreItem: true,
        rankingList: [],
        lastVisibleId: null,
      };
    }

    return null;
  }

  public render() {
    const { hasMoreItem, rankingList, lastUpdatedAt } = this.state;

    return (
      <React.Fragment>
        <LastUpdateTime time={lastUpdatedAt} />
        <RankingList
          hasMoreItem={hasMoreItem}
          list={rankingList}
          loadMoreItem={this.loadMoreItem}
        />
      </React.Fragment>
    );
  }

  private loadMoreItem = async ({ startIndex, stopIndex }: IndexRange) => {
    const { lastVisibleId, game } = this.state;

    const region = "asia-northeast1";
    const projectId = "school-idol-game-development";
    const baseUrl = `https://${region}-${projectId}.cloudfunctions.net`;
    const search = new URLSearchParams();
    if (lastVisibleId) {
      search.set("lastVisibleId", lastVisibleId);
    }
    const res = await fetch(`${baseUrl}/api/games/${game}/ranking?${search}`);
    const { scores, updatedAt } = await res.json();

    if (scores.length === 0) {
      console.log("no more scores");
      this.setState({ hasMoreItem: false });
      return;
    }

    this.setState((state) => {
      if (state.game !== game) {
        console.log(
          `active game; ${game} is changed. ignore this game ranking list push.`
        );
        return null;
      }

      const pushedItems = state.rankingList;
      scores.forEach((score: any) => {
        pushedItems.push(
          <RankItem
            rank={score.rank}
            userName={score.userName}
            point={score.point}
            member={score.member}
          />
        );
      });

      const newState = {
        ...state,
        rankingList: pushedItems,
        lastVisibleId: scores[scores.length - 1].id,
        lastUpdatedAt: new Date(updatedAt),
      };

      return newState;
    });
  };
}
