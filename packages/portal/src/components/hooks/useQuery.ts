import { useMemo } from "react";
import { useRouter } from "next/router";

const useQuery = <T>(key: string, expectedValues: ReadonlyArray<T>) => {
  const router = useRouter();
  const queryValue: T | null = useMemo(() => {
    // https://github.com/vercel/next.js/discussions/11484#discussioncomment-139578
    const values =
      router.asPath.match(new RegExp(`[&?]${key}=(.*)(&|$)`)) || [];
    const value: any = values[1];

    return expectedValues.includes(value) ? value : null;
  }, [key, router]);

  return { value: queryValue };
};

export default useQuery;
