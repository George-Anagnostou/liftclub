import { useState } from "react";
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

  const sliderStyle = () => {
    switch (builderType) {
      case "workout":
        return { marginLeft: "0vw" };
      case "routine":
        return { marginLeft: "-100vw" };
      case "team":
        return { marginLeft: "-200vw" };
    }
  };

  return (
    <Container>
      {user ? (
        <>
          <BuilderSelectBar builderType={builderType} setBuilderType={setBuilderType} />
          <BuilderSlideContainer style={sliderStyle()}>
            {Builders.map((Builder) => (
              <div className="builder">{Builder}</div>
            ))}
          </BuilderSlideContainer>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
`;

const BuilderSlideContainer = styled.div`
  width: 300vw;
  min-height: 100vh;
  display: flex;
  transition: margin 0.2s ease;

  .builder {
    width: 100vw;
  }
`;
