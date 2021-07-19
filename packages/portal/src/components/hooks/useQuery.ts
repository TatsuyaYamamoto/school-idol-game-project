import { useMemo } from "react";
import { useRouter } from "next/router";

const useQuery = <T>(key: string, expectedValues: ReadonlyArray<T>) => {
  const { query, isReady } = useRouter();

  const queryValue: T | null = useMemo(() => {
    const value: any = query[key];
    return expectedValues.includes(value) ? value : null;
  }, [key, expectedValues, query]);

  return { value: queryValue, isReady };
};

export default useQuery;
