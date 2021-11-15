import { useEffect, useState } from "react";

export function useDebouncedState<T>(state: T, delay: number) {
  const [debouncedState, setDebouncedState] = useState(state);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedState(state), delay);
    return () => clearTimeout(timeout);
  }, [state]);

  return debouncedState;
}
