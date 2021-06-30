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
  const [startPos, setStartPos] = useState(null);
  const [builderType, setBuilderType] = useState(router.query.builder || "workout");

  // Handles margin when builder tabs clicked
  useEffect(() => {
    if (builderType === "workout") {
      setMargin(0);
    } else if (builderType === "routine") {
      setMargin(-100);
    } else if (builderType === "team") {
      setMargin(-200);
    }
  }, [builderType]);

  // Set the starting touch position {x,y}
  const touchStart = (e) => setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });

  const touchMove = (e) => {
    const currPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    // Number (0 - 100) in view width / height units (vw / vh)
    const xDiff = (((startPos.x - currPos.x) / window.innerWidth) * 100).toFixed();
    const yDiff = (((startPos.y - currPos.y) / window.innerHeight) * 100).toFixed();

    // In vw / vh units
    const horizThreshold = 5;
    const vertThreshold = 5;

    // yDiff must be less than 10vh AND xDiff must be greater than 5vw
    // If true, horizontal sliding will commence
    if (Math.abs(yDiff) < vertThreshold && Math.abs(xDiff) > horizThreshold) {
      // Prevent scrolling vertically
      document.body.style.height = "100vh";
      document.body.style.overflow = "hidden";

      // Add extra margin depending on which builder is shown
      if (builderType === "workout") setMargin(-xDiff);
      if (builderType === "routine") setMargin(-xDiff - 100);
      if (builderType === "team") setMargin(-xDiff - 200);
    }
  };

  const touchEnd = () => {
    setMargin((prev) => {
      // Slide back to workout
      if (prev > -50) {
        if (builderType !== "workout") {
          // Scroll to top if the builder is changed
          setBuilderType("workout");
          window.scrollTo(0, 0);
        }
        return 0;
      }

      // Slide back to routine
      if (prev > -150) {
        if (builderType !== "routine") {
          setBuilderType("routine");
          window.scrollTo(0, 0);
        }
        return -100;
      }

      // Slide back to team
      if (builderType !== "team") {
        setBuilderType("team");
        window.scrollTo(0, 0);
      }
      return -200;
    });

    setStartPos(null);

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
  }, [startPos]);

  useEffect(() => {
    if (router.query.builder) setBuilderType(router.query.builder);
  }, [router.query]);

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
