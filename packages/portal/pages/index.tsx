import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

const IndexPage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/game-list`);
  }, [router]);

  return <div></div>;
};

export default IndexPage;
