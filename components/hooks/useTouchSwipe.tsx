import { useEffect, useState } from "react";

/**
 *
 * @param {element} ref
 * @param {string or array} targetDirection
 * @param {function} callback that gets called
 */
const useTouchSwipe = (
  ref: React.RefObject<HTMLDivElement>,
  targetDirection: string[],
  callback: () => void
) => {
  const [isSwipping, setIsSwipping] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [direction, setDirection] = useState<string[] | null>(null);

  const isOutsideBox = ({ target }) => {
    return ref.current && !ref.current.contains(target);
  };

  const touchStart = (e) => {
    if (isOutsideBox(e)) return;
    setIsSwipping(true);
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const touchMove = (e) => {
    if (isOutsideBox(e)) return;

    e.preventDefault();
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";

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
      document.body.style.height = "auto";
      document.body.style.overflow = "auto";

      setIsSwipping(false);
      setStartPos(null);
      setDirection(null);
    }
  };

  useEffect(() => {
    window.addEventListener("touchstart", touchStart, { passive: false });
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("touchend", touchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchstart", touchStart, { capture: false });
      window.removeEventListener("touchmove", touchMove, { capture: false });
      window.removeEventListener("touchend", touchEnd, { capture: false });
    };
  }, [touchStart, touchEnd]);

  useEffect(() => {
    const isSwipingInTargetDirection = targetDirection.some((dir) => direction?.includes(dir));

    if (isSwipping && direction && isSwipingInTargetDirection) callback();
  }, [direction, isSwipping]);
};
export default useTouchSwipe;
