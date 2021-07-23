import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import FooterSection from "../../src/components/organisms/FooterSection";
import AppBar from "../../src/components/organisms/AppBar";
import GameList from "../../src/components/organisms/GameList";

const data = [{}, {}, {}] as const;

const GameListPage: NextPage = () => {
  const router = useRouter();

  return (
    <div>
      <AppBar tab="game-list" />
      <GameList />
      <FooterSection />
    </div>
  );
};

export default GameListPage;
