import * as React from "react";
import { IndexRange } from "react-virtualized";
import AutoBind from "autobind-decorator";

import {
  firebaseDb,
  MetadataDocument,
  RankItemDocument,
  getLogger
} from "@sokontokoro/mikan";

import RankingList from "../molecules/RankingList";
import RankItem from "../molecules/RankItem";
import { QuerySnapshot } from "@google-cloud/firestore";

const logger = getLogger("RankingSection");

interface Props {
  game: string;
  initialized: boolean;
}

interface State {
  hasMoreItem: boolean;
  game: string;
  rankingList: JSX.Element[];
  lastVisibleSnapshot: any;
}

@AutoBind
export default class RankingSection extends React.Component<Props, State> {
  public constructor(props: any) {
    super(props);

    this.state = {
      game: this.props.game,
      hasMoreItem: true,
      rankingList: [],
      lastVisibleSnapshot: null
    };
  }

  public static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.game !== prevState.game) {
      logger.debug(`change game. ${prevState.game} -> ${nextProps.game}`);

      return {
        game: nextProps.game,
        hasMoreItem: true,
        rankingList: [],
        lastVisibleSnapshot: null
      };
    }

    return null;
  }

  public render() {
    const { initialized } = this.props;
    const { hasMoreItem, rankingList } = this.state;

    const initializing = <div>Initializing...</div>;

    return (
      <React.Fragment>
        {initialized ? (
          <RankingList
            hasMoreItem={hasMoreItem}
            list={rankingList}
            loadMoreItem={this.loadMoreItem}
          />
        ) : (
          initializing
        )}
      </React.Fragment>
    );
  }

  private async loadMoreItem({ startIndex, stopIndex }: IndexRange) {
    const { lastVisibleSnapshot, game } = this.state;

    const limit = stopIndex - startIndex + 1;
    const metadataRef = firebaseDb.collection("metadata").doc(game);
    const metadata = (await metadataRef.get()).data() as MetadataDocument;

    let scores: firebase.firestore.QuerySnapshot;
    if (lastVisibleSnapshot) {
      scores = await metadata.rankingRef
        .collection("list")
        .orderBy("point", "desc")
        .startAfter(lastVisibleSnapshot)
        .limit(limit)
        .get();
    } else {
      scores = await metadata.rankingRef
        .collection("list")
        .orderBy("point", "desc")
        .limit(limit)
        .get();
    }

    if (scores.size === 0) {
      logger.debug("no more scores");
      this.setState({ hasMoreItem: false });
      return;
    }

    const pushedItems = this.state.rankingList;
    scores.forEach(r => {
      const doc = r.data() as RankItemDocument;
      pushedItems.push(
        <RankItem
          rank={doc.rank}
          userName={doc.userName}
          point={doc.point}
          member={doc.member}
        />
      );
    });

    this.setState({
      rankingList: pushedItems,
      lastVisibleSnapshot: scores.docs[scores.size - 1]
    });
  }
}
