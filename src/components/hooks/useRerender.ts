import { useState } from "react";

function useRerender() {
  const [, rerender] = useState(false);
  return {
    triggerRerender: () => {
      rerender(true);
      setTimeout(() => rerender(false), 10);
    },
  };
}

export default useRerender;
