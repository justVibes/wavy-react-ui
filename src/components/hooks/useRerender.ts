import { useState } from "react";

function useRerender() {
  const [, setRendered] = useState(false);
  return {
    triggerRerender: () => setRendered((rendered) => !rendered),
  };
}

export { useRerender };
