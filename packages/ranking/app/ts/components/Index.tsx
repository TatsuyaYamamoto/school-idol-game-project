import * as React from "react";

import {
  initAuth,
  firebaseDb,
  MetadataDocument,
  RankItemDocument
} from "@sokontokoro/mikan";

import RankItem from "./RankItem";

interface Props {}

interface State {
  game: string;
  offset: number;
  limit: number;
  rankingItems: RankItemDocument[];
}

class Index extends React.Component<Props, State> {
  constructor(params: any) {
    super(params);

    this.state = {
      game: "maruten",
      offset: 0,
      limit: 10,
      rankingItems: []
    };
  }
  public componentDidMount() {
    this.load();
  }

  render() {
    const { rankingItems } = this.state;

    return (
      <div>
        <h2>Ranking!</h2>

        <div>
          {rankingItems.map(item => {
            return (
              <RankItem
                key={item.uid}
                userName={item.userName}
                rank={item.rank}
                point={item.point}
              />
            );
          })}
        </div>
      </div>
    );
  }

  private load = async () => {
    await initAuth();

    const { game, offset, limit } = this.state;

    const metadataRef = firebaseDb.collection("metadata").doc(game);

    const metadata = (await metadataRef.get()).data() as MetadataDocument;
    const scores = await metadata.rankingRef
      .collection("list")
      .orderBy("point", "desc")
      .limit(limit)
      .get();

    const rankingItems: RankItemDocument[] = [];
    scores.forEach(r => {
      rankingItems.push(r.data() as RankItemDocument);
    });

    this.setState({ rankingItems });
  };
}

export default Index;
