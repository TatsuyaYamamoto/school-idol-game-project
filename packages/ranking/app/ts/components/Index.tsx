import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import {
  firebaseDb,
  initAuth,
  MetadataDocument,
  RankItemDocument
} from "@sokontokoro/mikan";

import { IndexRouteParams } from "../App";
import RankingList from "./RankingList";
import { IndexRange, AutoSizer, WindowScroller } from "react-virtualized";
import RankItem from "./RankItem";
import GameSelector from "./GameSelector";

interface Props {}

interface State {
  initialIndex: number;
  initialized: boolean;
  hasMoreItem: boolean;
  isLoading: boolean;
  rankingList: JSX.Element[];
  lastVisibleSnapshot: any;
}

export const list = [
  {
    title: "ほのCar",
    gameId: "maruten", // for dev
    imageUrl:
      "http://games.sokontokoro-factory.net/honocar/img/TITLE_LOGO_HONOKA.png"
  },
  {
    title: "しゃかりん",
    gameId: "maruten", // for dev
    imageUrl: "http://games.sokontokoro-factory.net/shakarin/img/TITLE_LOGO.png"
  },
  {
    title: "まるてん",
    gameId: "maruten",
    imageUrl:
      "http://games.sokontokoro-factory.net/maruten/img/TITLE_LOGO_HANAMARU.png"
  }
];

const defaultState = {
  initialIndex: 0,
  initialized: false,
  hasMoreItem: true,
  isLoading: false,
  rankingList: [],
  lastVisibleSnapshot: null
};

class Index extends React.Component<
  Props & RouteComponentProps<IndexRouteParams>,
  State
> {
  state: State;

  constructor(props: any) {
    super(props);

    const initialIndex = list.findIndex(({ gameId }) => {
      return gameId === this.props.match.params.game;
    });

    this.state = {
      initialIndex,
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
    console.log("index render", this.state);

    const {
      initialized,
      initialIndex,
      hasMoreItem,
      isLoading,
      rankingList
    } = this.state;

    const initializing = <div>Initializing...</div>;

    return (
      <div>
        <h2>Ranking!</h2>
        <GameSelector
          list={list}
          initialIndex={initialIndex}
          slickSettings={{}}
          onSelected={this.onGameSelected}
        />
        {initialized ? (
          <RankingList
            hasMoreItem={hasMoreItem}
            isLoading={isLoading}
            list={rankingList}
            loadMoreItem={this.loadMoreItem}
          />
        ) : (
          initializing
        )}
      </div>
    );
  }

  private onGameSelected = (index: number) => {
    console.log("on selected: " + index, defaultState);

    this.props.history.replace(`/${list[index].gameId}`);

    this.setState({
      initialIndex: 0,
      initialized: true,
      hasMoreItem: true,
      isLoading: false,
      rankingList: [],
      lastVisibleSnapshot: null
    });
  };

  private loadMoreItem = async ({ startIndex, stopIndex }: IndexRange) => {
    const { game } = this.props.match.params;
    const { lastVisibleSnapshot } = this.state;

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
