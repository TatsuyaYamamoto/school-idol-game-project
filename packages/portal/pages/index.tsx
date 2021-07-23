import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

const IndexPage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      const { query } = router;
      router.replace({ pathname: `/portal/game-list`, query });
    }
  }, [router]);

  return <div></div>;
};

export default IndexPage;
