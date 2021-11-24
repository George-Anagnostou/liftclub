import React from "react";
import styled from "styled-components";
import { Exercise, Set } from "../../types/interfaces";
import { formatIsoDate } from "../../utils";

interface Props {
  exercise: Exercise;
  exerciseHistory: { sets: Set[]; date: string; exercise_id: string }[];
}

const ExerciseStats: React.FC<Props> = ({ exercise, exerciseHistory }) => {
  const formatWeight = (weight: string | number) =>
    typeof weight === "string" || weight === -1 ? 0 : weight;

  const getMaxNumber = (arr: number[]) => Math.max(...arr);
  const getMinNumber = (arr: number[]) => Math.min(...arr);
  const getWeightsFromSets = (sets: Set[]) => sets.flatMap(({ weight }) => formatWeight(weight));

  const allSets = exerciseHistory.map(({ sets }) => sets).flat();
  const weights = allSets.map(({ weight }) => formatWeight(weight));
  const maxWeight = Math.max(...weights);

  let volume = 0;
  allSets.map((set) => (volume += formatWeight(set.weight) * set.reps));

  const getMaxWeightFromSets = (sets: Set[]) => getMaxNumber(getWeightsFromSets(sets));
  const getMinWeightFromSets = (sets: Set[]) => getMinNumber(getWeightsFromSets(sets));

  const diffInMaxWeight =
    getMaxWeightFromSets(exerciseHistory[0].sets) -
    getMaxWeightFromSets(exerciseHistory[exerciseHistory.length - 1].sets);
  return (
    <Container>
      <div className="tile max">
        <span className="title">Max weight</span>
        <p className="large-num">
          {maxWeight.toLocaleString()}
          <span> lbs</span>
        </p>
      </div>

      <div className="tile increase">
        <span className="title">
          Since {formatIsoDate(exerciseHistory[exerciseHistory.length - 1].date)}
        </span>
        <p className="large-num">
          {diffInMaxWeight.toLocaleString()}
          <span> lbs</span>
        </p>
      </div>

      <div className="tile count">
        <span className="title">Total sets</span>
        <p className="small-num">{allSets.length.toLocaleString()}</p>
      </div>

      <div className="tile volume">
        <span className="title">Total volume</span>
        <p className="small-num">
          {volume.toLocaleString()}
          <span> lbs</span>
        </p>
      </div>

      <div className="tile logged">
        <span className="title">Logged</span>
        <p className="small-num">{exerciseHistory.length.toLocaleString()}</p>
      </div>
    </Container>
  );
};

export default ExerciseStats;

const Container = styled.div`
  flex: 1;
  height: 150px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 0.75fr;
  justify-content: center;
  grid-gap: 0.5rem;

  .tile {
    padding: 1rem 0 0;
    background: ${({ theme }) => theme.buttonMedGradient};
    border-radius: 5px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .title {
      position: absolute;
      top: 0.25rem;
      left: 0.5rem;
      font-weight: 200;
      font-size: 0.8rem;
    }

    .large-num {
      font-size: 2.25rem;
      font-weight: 200;

      span {
        font-weight: 200;
        font-size: 0.85rem;
      }
    }

    .small-num {
      font-size: 1.5rem;
      font-weight: 200;

      span {
        font-weight: 200;
        font-size: 0.65rem;
      }
    }
  }

  .max {
    grid-column: 1 / span 2;
  }
  .increase {
    grid-column: 3 / span 2;
  }
  .count {
    grid-column: 1 / span 1;
  }
  .volume {
    grid-column: 2 / span 2;
  }
  .logged {
    grid-column: 4 / span 1;
  }
`;
