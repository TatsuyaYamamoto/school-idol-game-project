import { NextPage } from "next";
import { useRouter } from "next/router";

import useQuery from "../src/components/hooks/useQuery";
import AppBar from "../src/components/organisms/AppBar";
import FooterSection from "../src/components/organisms/FooterSection";
import HelpList from "../src/components/organisms/HelpList";

const HelpPage: NextPage = (props) => {
  const router = useRouter();
  const { value: hostLanguageQueryValue } = useQuery("hl", [
    "ja",
    "en",
  ] as const);
  const language = hostLanguageQueryValue || "ja";

  const onTabChanged = () => {};

  const onTranslate = () => {};

  return (
    <div>
      <AppBar
        language={language}
        onTabChanged={onTabChanged}
        onTranslate={onTranslate}
      />

      <HelpList language={language} />

      <FooterSection />
    </div>
  );
};

export default HelpPage;
