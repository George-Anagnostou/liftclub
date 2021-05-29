import { useRef, useEffect, useState } from "react";

export default function SwipeBox({ children, targetDirection, toggler }) {
  const wrapper = useRef();

  const [isSwipping, setIsSwipping] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [direction, setDirection] = useState(null);

  const isOutsideBox = ({ target }) => {
    if (wrapper.current && !wrapper.current.contains(target)) return true;
  };

  const touchStart = (e) => {
    if (isOutsideBox(e)) return;

    setIsSwipping(true);

    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const touchMove = (e) => {
    if (isOutsideBox(e)) return;
    const currPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    if (startPos.x < currPos.x && startPos.y < currPos.y && direction === null)
      setDirection(["right", "down"]);
    if (startPos.x > currPos.x && startPos.y < currPos.y && direction === null)
      setDirection(["left", "down"]);
    if (startPos.x < currPos.x && startPos.y > currPos.y && direction === null)
      setDirection(["right", "up"]);
    if (startPos.x > currPos.x && startPos.y > currPos.y && direction === null)
      setDirection(["left", "up"]);
  };

  const touchEnd = (e) => {
    if (isSwipping) {
      setIsSwipping(false);
      setDirection(null);
    }
  };

  useEffect(() => {
    window.addEventListener("touchstart", touchStart);
    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchend", touchEnd);

    return () => {
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", touchEnd);
    };
  }, [touchStart, touchEnd]);

  useEffect(() => {
    if (isSwipping && targetDirection.some((val) => direction.indexOf(val) >= 0)) {
      toggler((prev) => !prev);
    }
  }, [direction]);

  return <div ref={wrapper}>{children}</div>;
}
