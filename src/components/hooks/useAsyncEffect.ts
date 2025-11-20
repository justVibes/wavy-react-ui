import { useEffect } from "react";

function useAsyncEffect(
  asyncEffect: () => Promise<unknown>,
  deps: React.DependencyList
) {
  useEffect(() => {
    const abortController = new AbortController();

    asyncEffect();
    return () => {
      abortController.abort(); // cancel pending fetch request on component unmount
    };
  }, deps);
}

export { useAsyncEffect };
