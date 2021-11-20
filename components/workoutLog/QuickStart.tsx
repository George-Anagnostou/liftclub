import React from "react";
import styled from "styled-components";
// SVG
import LightningBolt from "../svg/LightningBolt";

interface Props {
  displayOnTheFlyWorkout: () => void;
}

const QuickStart: React.FC<Props> = ({ displayOnTheFlyWorkout }) => {
  return (
    <Container>
      <h1 className="title">Quick Start</h1>

      <div className="on-the-fly" onClick={displayOnTheFlyWorkout}>
        <h3>
          <LightningBolt /> On the Fly
        </h3>
        <p>Start with a blank workout and track your exercises as you go.</p>
      </div>
    </Container>
  );
};

export default QuickStart;

const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  margin: 0 0 0.5rem;

  .title {
    font-weight: 200;
    text-align: left;
    margin-bottom: 0.5rem;
  }

  .on-the-fly {
    text-align: left;
    background: ${({ theme }) => theme.buttonMed};
    border-radius: 10px;
    padding: 0.5rem;
    box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

    h3 {
      font-weight: 300;
      display: flex;
      align-items: center;
    }
    svg {
      border: 1px solid ${({ theme }) => theme.accent};
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
      margin: 0 1rem;
    }
  }
`;
