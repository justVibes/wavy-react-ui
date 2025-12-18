import { BasicDiv } from "@/main";
import { Spinner } from "@chakra-ui/react";
import React, { Activity, useEffect, useState } from "react";

interface DebounceProps {
  /**@default 300 */
  delay?: number;
  isDataLoaded?: () => boolean;
  children: () => React.ReactNode;
  LoadingScreen?: () => React.ReactElement;
}
function Debounce(props: DebounceProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      if (props.isDataLoaded) {
        await new Promise<void>((res) => {
          while (!props.isDataLoaded()) {}
          res();
        });
      }

      setLoading(false);
    }, props.delay || 300);
  }, []);

  return (
    <>
      <Activity mode={loading ? "visible" : "hidden"}>
        {props.LoadingScreen ? (
          <props.LoadingScreen />
        ) : (
          <BasicDiv size={"full"} centerContent>
            <Spinner />
          </BasicDiv>
        )}
      </Activity>
      <Activity mode={loading ? "hidden" : "visible"}>
        <props.children />
      </Activity>
    </>
  );
}

export { Debounce, type DebounceProps};
