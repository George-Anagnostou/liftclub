import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
// Components
import WorkoutBuilder from "../components/builder/workout";
import RoutineBuilder from "../components/builder/routine";
import TeamBuilder from "../components/builder/team";
import BuilderSelectBar from "../components/builder/BuilderSelectBar";

const Builders = [
  { slug: "workout", component: <WorkoutBuilder /> },
  { slug: "routine", component: <RoutineBuilder /> },
  { slug: "team", component: <TeamBuilder /> },
];

export default function builder() {
  const router = useRouter();

  const [margin, setMargin] = useState(0); // Margin for SlideContainer
  const [builderType, setBuilderType] = useState(router.query.builder?.toString() || "workout"); // 'workout' 'routine' 'team'

  // Set builder if a certain one is queried for
  useEffect(() => {
    if (router.query.builder) setBuilderType(router.query.builder.toString());
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
      <BuilderSelectBar builderType={builderType} setBuilderType={setBuilderType} />

      <BuilderSlideContainer style={{ marginLeft: `${margin}vw` }}>
        {Builders.map(({ slug, component }, i) => (
          <div className="builder" key={i} style={builderType !== slug ? { height: 0 } : {}}>
            {component}
          </div>
        ))}
      </BuilderSlideContainer>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const BuilderSlideContainer = styled.div`
  width: 300vw;
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
