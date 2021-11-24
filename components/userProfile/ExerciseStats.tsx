import React from "react";
import { Exercise, Set } from "../../types/interfaces";

interface Props {
  exercise: Exercise;
  exerciseHistory: { sets: Set[]; date: string; exercise_id: string }[];
}

const ExerciseStats: React.FC<Props> = ({ exercise, exerciseHistory }) => {
  return (
    <div>
      {/* <h3>{exercise.name}</h3>
      <p>Max</p>
      <p>Percentage increase</p> */}
    </div>
  );
};

export default ExerciseStats;
