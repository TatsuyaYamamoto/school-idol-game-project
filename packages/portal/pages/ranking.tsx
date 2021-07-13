import { NextPage } from "next";
import { useRouter } from "next/router";

import { GAMES, gameIds } from "../src/utils/tmp_mikan";

import ControlSection from "../src/components/organisms/ControlSection";
import RankingSection from "../src/components/organisms/RankingSection";
import FooterSection from "../src/components/organisms/FooterSection";
import AppBar from "../src/components/organisms/AppBar";

const RankingPage: NextPage = () => {
  const router = useRouter();
  const locale = (router.locale ?? "ja") as "ja" | "en";
  const game = "honocar";

  const onTabChanged = (page: "ranking" | "help") => {
    router.push(`/${page}`, { query: router.query });
  };

  const onTranslate = (locale: "ja" | "en") => {
    console.log("translate", locale);
  };

  const onGameSelected = (index: number) => {
    const game = gameIds[index];
    router.replace(`/ranking`, { query: { game } });
  };

  const onJumpGame = () => {
    location.href = GAMES[game].url;
  };

  return (
    <div>
      <AppBar
        locale={locale}
        onTabChanged={onTabChanged}
        onTranslate={onTranslate}
      />

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
