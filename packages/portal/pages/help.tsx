import { NextPage } from "next";
import { useRouter } from "next/router";

import AppBar from "../src/components/organisms/AppBar";
import FooterSection from "../src/components/organisms/FooterSection";
import HelpList from "../src/components/organisms/HelpList";

const HelpPage: NextPage = (props) => {
  const router = useRouter();
  const locale = (router.locale || "ja") as "ja" | "en";

  const onTabChanged = () => {};

  const onTranslate = () => {};

  return (
    <div>
      <AppBar
        locale={locale}
        onTabChanged={onTabChanged}
        onTranslate={onTranslate}
      />

      <HelpList locale={locale} />

      <FooterSection />
    </div>
  );
};

export default HelpPage;
