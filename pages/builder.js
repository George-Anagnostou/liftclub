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
  const slider = useRef(null);
  const { user } = useStoreState();

  const [builderType, setBuilderType] = useState("workout");

  const [margin, setMargin] = useState(0);

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
          <BuilderSlideContainer style={{ marginLeft: `${margin}vw` }} ref={slider}>
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
  }
`;
