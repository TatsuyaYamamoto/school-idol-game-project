import { NextPage } from "next";

import AppBar from "../../src/components/organisms/AppBar";
import FooterSection from "../../src/components/organisms/FooterSection";
import HelpList from "../../src/components/organisms/HelpList";

const HelpPage: NextPage = () => {
  return (
    <div>
      <AppBar tab="help" />

      <HelpList />

      <FooterSection />
    </div>
  );
};

export default HelpPage;
