import * as React from "react";

import {
  firebaseDb,
  initAuth,
  MetadataDocument,
  RankItemDocument
} from "@sokontokoro/mikan";

import RankingList from "./RankingList";
import {
  IndexRange,
  ListRowProps,
  InfiniteLoader,
  List,
  AutoSizer,
  WindowScroller
} from "react-virtualized";
import RankItem from "./RankItem";

interface Props {}

interface State {
  game: string;
  initialized: boolean;
  hasMoreItem: boolean;
  isLoading: boolean;
  rankingList: JSX.Element[];
  lastVisibleSnapshot: any;
}

class Index extends React.Component<Props, State> {
  constructor(params: any) {
    super(params);

    this.state = {
      game: "maruten",
      initialized: false,
      hasMoreItem: true,
      isLoading: false,
      rankingList: [],
      lastVisibleSnapshot: null
    };
  }
  public componentDidMount() {
    this.init();
  }

  render() {
    const { initialized, hasMoreItem, isLoading, rankingList } = this.state;

    return (
      <div>
        <h2>Ranking!</h2>
        {initialized && (
          <WindowScroller>
            {({ height }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <RankingList
                    width={width}
                    height={height}
                    hasMoreItem={hasMoreItem}
                    isLoading={isLoading}
                    list={rankingList}
                    loadMoreItem={this.loadMoreItem}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </div>
    );
  }

  private loadMoreItem = async ({ startIndex, stopIndex }: IndexRange) => {
    const { game, lastVisibleSnapshot } = this.state;

    const limit = stopIndex - startIndex + 1;

    console.log("loadMoreRows", startIndex, stopIndex);

    const metadataRef = firebaseDb.collection("metadata").doc(game);
    const metadata = (await metadataRef.get()).data() as MetadataDocument;

    let scores = null;
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
      console.log("no more scores");
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
  };

  private init = async () => {
    await initAuth();
    this.setState({ initialized: true });
  };
}

export default Index;
