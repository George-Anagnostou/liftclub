import { useRef } from "react";

const useCountRenders = () => {
  const renders = useRef(0);
  // console.log("renders:", renders.current++);
  return renders.current++;
};

export default useCountRenders;
