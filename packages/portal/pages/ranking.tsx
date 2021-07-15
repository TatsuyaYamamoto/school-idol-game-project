import { NextPage } from "next";
import { useRouter } from "next/router";

import { GAMES, gameIds } from "../src/utils/tmp_mikan";

import ControlSection from "../src/components/organisms/ControlSection";
import RankingSection from "../src/components/organisms/RankingSection";
import FooterSection from "../src/components/organisms/FooterSection";
import AppBar from "../src/components/organisms/AppBar";
import useQuery from "../src/components/hooks/useQuery";

const RankingPage: NextPage = () => {
  const router = useRouter();
  const { value: gameQueryValue } = useQuery("game", gameIds);
  const { value: hostLanguageQueryValue } = useQuery("hl", [
    "ja",
    "en",
  ] as const);

  const game = gameQueryValue || "honocar";

  const onTabChanged = (page: "ranking" | "help") => {
    router.push({ pathname: `/${page}`, query: router.query });
  };

  const onGameSelected = (index: number) => {
    const newGame = gameIds[index];
    router.replace(`/ranking`, { query: { game: newGame } });
  };

  const onJumpGame = () => {
    location.href = GAMES[game].url;
  };

  return (
    <div>
      <AppBar tab="ranking" onTabChanged={onTabChanged} />

      <ControlSection
        game={game}
        onGameSelected={onGameSelected}
        onJumpGame={onJumpGame}
      />

      <RankingSection game={game} />

      <FooterSection />
    </div>
  );
};

export default RankingPage;
