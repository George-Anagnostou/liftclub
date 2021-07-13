import { useRef } from "react";

const useCountRenders = (): void => {
  const renders = useRef(0);
  console.log("renders:", renders.current++);
};

export default useCountRenders;
