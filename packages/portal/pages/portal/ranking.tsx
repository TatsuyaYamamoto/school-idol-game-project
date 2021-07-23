import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { GAMES, gameIds } from "../../src/utils/tmp_mikan";

import ControlSection from "../../src/components/organisms/ControlSection";
import RankingSection from "../../src/components/organisms/RankingSection";
import FooterSection from "../../src/components/organisms/FooterSection";
import AppBar from "../../src/components/organisms/AppBar";
import useQuery from "../../src/components/hooks/useQuery";

const RankingPage: NextPage = () => {
  const router = useRouter();
  const { value: gameQueryValue, isReady: isGameQueryReady } = useQuery(
    "game",
    gameIds
  );

  const onGameSelected = (index: number) => {
    const newGame = gameIds[index];
    router.replace({ query: { game: newGame } });
  };

  const onJumpGame = () => {
    if (!gameQueryValue) {
      return;
    }
    location.href = GAMES[gameQueryValue].url;
  };

  useEffect(() => {
    if (!isGameQueryReady) {
      return;
    }
    if (gameQueryValue) {
      return;
    }
    router.replace({ query: { game: "honocar" } });
  }, [gameQueryValue, router, isGameQueryReady]);

  return (
    <div>
      <AppBar tab="ranking" />

      {gameQueryValue && (
        <>
          <ControlSection
            game={gameQueryValue}
            onGameSelected={onGameSelected}
            onJumpGame={onJumpGame}
          />
          <RankingSection game={gameQueryValue} />
        </>
      )}

      <FooterSection />
    </div>
  );
};

export default RankingPage;
