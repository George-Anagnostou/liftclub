import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
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
  const router = useRouter();

  const { user } = useStoreState();

  // Margin for SlideContainer
  const [margin, setMargin] = useState(0);
  const [startPos, setStartPos] = useState(null); // position of touchstart
  const [slideDistance, setSlideDistance] = useState(0); // distance touch has slid (x-axis view width)
  const [builderType, setBuilderType] = useState(router.query.builder || "workout"); // 'workout' 'routine' 'team'

  const slideBuilderRight = () => {
    if (builderType === "workout") {
      setBuilderType("routine");
      window.scrollTo(0, 0);
    } else if (builderType === "routine") {
      setBuilderType("team");
      window.scrollTo(0, 0);
    } else {
      recenterBuilder(builderType);
    }
  };

  const slideBuilderLeft = () => {
    if (builderType === "routine") {
      setBuilderType("workout");
      window.scrollTo(0, 0);
    } else if (builderType === "team") {
      setBuilderType("routine");
      window.scrollTo(0, 0);
    } else {
      recenterBuilder(builderType);
    }
  };

  const recenterBuilder = (type) => {
    setBuilderType("");
    setBuilderType(type);
  };

  // Set the starting touch position {x,y}
  const touchStart = (e) => setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });

  const touchMove = (e) => {
    const currPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    // Number (0 - 100) in view width / view height units (vw / vh)
    const xDiff = (((startPos.x - currPos.x) / window.innerWidth) * 100).toFixed();
    const yDiff = (((startPos.y - currPos.y) / window.innerHeight) * 100).toFixed();

    setSlideDistance(xDiff);

    // In vw / vh units
    const horizThreshold = 5;
    const vertThreshold = 5;

    // MOVE SLIDER TO FOLLOW TOUCH POSITION
    // yDiff must be less than 10vh AND xDiff must be greater than 5vw
    // If true, horizontal sliding will follow touch
    if (Math.abs(yDiff) < vertThreshold && Math.abs(xDiff) > horizThreshold) {
      // Prevent scrolling vertically
      document.body.style.height = "100vh";
      document.body.style.overflow = "hidden";

      if (builderType === "workout") setMargin(-xDiff);
      else if (builderType === "routine") setMargin(-xDiff - 100);
      else if (builderType === "team") setMargin(-xDiff - 200);
    }
  };

  const touchEnd = () => {
    if (slideDistance > 20) {
      slideBuilderRight();
    } else if (slideDistance < -20) {
      slideBuilderLeft();
    } else {
      recenterBuilder(builderType);
    }

    setStartPos(null);
    setSlideDistance(0);

    // Reset body styles
    document.body.style.height = "auto";
    document.body.style.overflow = "auto";
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
  }, [margin, startPos, slideDistance]);

  useEffect(() => {
    if (router.query.builder) setBuilderType(router.query.builder);
  }, [router.query]);

  // Sets margin when builder type changes
  useEffect(() => {
    if (builderType === "workout") {
      setMargin(0);
    } else if (builderType === "routine") {
      setMargin(-100);
    } else if (builderType === "team") {
      setMargin(-200);
    }
  }, [builderType]);

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

  overscroll-behavior: contain;

  .loadingContainer {
    height: 100vh;
    display: grid;
    place-items: center;
  }
`;

const BuilderSlideContainer = styled.div`
  position: relative;
  width: 300vw;
  min-height: 100vh;
  height: min-content;

  display: flex;
  align-items: flex-start;
  transition: margin 0.2s ease-out;

  .builder {
    width: 100vw;
    padding: 0 0.5rem;
    box-sizing: content-box;
  }
`;
