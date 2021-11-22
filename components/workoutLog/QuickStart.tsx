import React from "react";
import styled from "styled-components";
// Interfaces
import { Workout } from "../../types/interfaces";
// SVG
import LightningBolt from "../svg/LightningBolt";
// Components
import TeamWorkouts from "./TeamWorkouts";
import UserWorkouts from "./UserWorkouts";

interface Props {
  displayOnTheFlyWorkout: () => void;
  displayPremadeWorkout: (clicked: Workout) => Promise<void>;
  selectedDate: string;
}

const QuickStart: React.FC<Props> = ({
  displayOnTheFlyWorkout,
  displayPremadeWorkout,
  selectedDate,
}) => {
  return (
    <Container>
      <h1 className="title">Quick Start</h1>

      <OnTheFly onClick={displayOnTheFlyWorkout}>
        <h3>
          <LightningBolt /> On the Fly
        </h3>
        <p>Start with a blank workout and track your exercises as you go.</p>
      </OnTheFly>

      <TeamWorkouts selectedDate={selectedDate} displayPremadeWorkout={displayPremadeWorkout} />

      <UserWorkouts displayPremadeWorkout={displayPremadeWorkout} />
    </Container>
  );
};

export default QuickStart;

const Container = styled.div`
  width: 100%;
  padding: 0.5rem 0.5rem 1px;
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  margin: 0 0 0.5rem;

  .title {
    font-weight: 200;
    text-align: left;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }

  .section-title {
    text-align: left;
    margin: 0.25rem 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: 200;
  }
`;

const OnTheFly = styled.div`
  text-align: left;
  background: ${({ theme }) => theme.buttonMedGradient};
  border-radius: 8px;
  padding: 0.5rem;
  margin: 0 0.25rem 0.75rem;
  box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};

  h3 {
    font-weight: 300;
    display: flex;
    align-items: center;
  }
  svg {
    border: 0.5px solid ${({ theme }) => theme.accent};
    box-shadow: 0 0 4px ${({ theme }) => theme.accent};
    border-radius: 50%;
    padding: 2px;
    background: ${({ theme }) => theme.buttonMed};
    margin: 0 0.5rem;
  }
  svg,
  path {
    fill: ${({ theme }) => theme.accentSoft};
  }

  p {
    color: ${({ theme }) => theme.textLight};
    font-size: 0.8rem;
    font-weight: 200;
    letter-spacing: 1px;
    margin: 0 1.1rem;
    padding: 0 1.2rem;
    border-left: 0.5px dashed ${({ theme }) => theme.accentSoft};
  }
`;
