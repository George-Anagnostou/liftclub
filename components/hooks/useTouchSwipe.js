import { useEffect, useState } from "react";

/**
 *
 * @param {element} ref
 * @param {string} targetDirection
 * @param {function} callback
 */
export default function useTouchSwipe(ref, targetDirection, callback) {
  const [isSwipping, setIsSwipping] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [direction, setDirection] = useState(null);

  const isOutsideBox = ({ target }) => {
    if (ref.current && !ref.current.contains(target)) return true;
  };

  const touchStart = (e) => {
    if (isOutsideBox(e)) return;
    setIsSwipping(true);
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const touchMove = (e) => {
    if (isOutsideBox(e)) return;
    const currPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    if (startPos && startPos.x < currPos.x && startPos.y < currPos.y && direction === null)
      setDirection(["right", "down"]);
    if (startPos && startPos.x > currPos.x && startPos.y < currPos.y && direction === null)
      setDirection(["left", "down"]);
    if (startPos && startPos.x < currPos.x && startPos.y > currPos.y && direction === null)
      setDirection(["right", "up"]);
    if (startPos && startPos.x > currPos.x && startPos.y > currPos.y && direction === null)
      setDirection(["left", "up"]);
  };

  const touchEnd = () => {
    if (isSwipping) {
      setIsSwipping(false);
      setStartPos(null);
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
    if (isSwipping && direction && direction.includes(targetDirection)) callback();
  }, [direction, isSwipping]);
}
