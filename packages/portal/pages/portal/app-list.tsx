import { NextPage } from "next";
import { useRouter } from "next/router";

import FooterSection from "../../src/components/organisms/FooterSection";
import AppBar from "../../src/components/organisms/AppBar";
import AppList from "../../src/components/organisms/AppList";

const GameListPage: NextPage = () => {
  const router = useRouter();

  return (
    <div>
      <AppBar tab="app-list" />
      <AppList />
      <FooterSection />
    </div>
  );
};

export default GameListPage;
