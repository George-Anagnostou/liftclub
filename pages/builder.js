import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
// Components
import LoadingSpinner from "../components/LoadingSpinner";
import WorkoutBuilder from "../components/builder/workout";
import RoutineBuilder from "../components/builder/routine";
import TeamBuilder from "../components/builder/team";
import BuilderSelectBar from "../components/builder/BuilderSelectBar";
// Context
import { useStoreState } from "../store";

const Builders = [<WorkoutBuilder />, <RoutineBuilder />, <TeamBuilder />];

export default function builder() {
  const { user } = useStoreState();

  const [builderType, setBuilderType] = useState("workout");
  // const [isSwipping, setIsSwipping] = useState(false);
  const [margin, setMargin] = useState(0);
  const [startPos, setStartPos] = useState(null);

  useEffect(() => {
    if (builderType === "workout") {
      setMargin(0);
    } else if (builderType === "routine") {
      setMargin(-100);
    } else if (builderType === "team") {
      setMargin(-200);
    }
  }, [builderType]);

  const touchStart = (e) => {
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const touchMove = (e) => {
    const currPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const xDiff = (((startPos.x - currPos.x) / window.innerWidth) * 100).toFixed();
    const yDiff = (((startPos.y - currPos.y) / window.innerHeight) * 100).toFixed();

    // yDiff must be less than 10vh AND xDiff must be greater than 5vw
    if (Math.abs(yDiff) < 10 && Math.abs(xDiff) > 5) {
      if (builderType === "workout") setMargin(-xDiff);
      if (builderType === "routine") setMargin(-xDiff - 100);
      if (builderType === "team") setMargin(-xDiff - 200);
    }
  };

  const touchEnd = () => {
    setMargin((prev) => {
      if (prev > -50) {
        setBuilderType("workout");
        return 0;
      }

      if (prev > -150) {
        setBuilderType("routine");
        return -100;
      }

      setBuilderType("team");
      return -200;
    });

    setStartPos(null);
  };

  useEffect(() => {
    window.addEventListener("touchstart", touchStart, { passive: false });
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("touchend", touchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchstart", touchStart, { passive: false });
      window.removeEventListener("touchmove", touchMove, { passive: false });
      window.removeEventListener("touchend", touchEnd, { passive: false });
    };
  }, [startPos]);

  return (
    <Container>
      {user ? (
        <>
          <BuilderSelectBar builderType={builderType} setBuilderType={setBuilderType} />
          <BuilderSlideContainer style={{ marginLeft: `${margin}vw` }}>
            {Builders.map((Builder, i) => (
              <div className="builder" key={i}>
                {Builder}
              </div>
            ))}
          </BuilderSlideContainer>
        </>
      ) : (
        <div className="loadingContainer">
          <LoadingSpinner />
        </div>
      )}
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .loadingContainer {
    height: 100vh;
    display: grid;
    place-items: center;
  }
`;

const BuilderSlideContainer = styled.div`
  width: 300vw;
  min-height: 100vh;
  display: flex;
  transition: margin 0.2s ease-out;

  .builder {
    width: 100vw;
    padding: 0 0.5rem;
    box-sizing: content-box;
  }
`;
