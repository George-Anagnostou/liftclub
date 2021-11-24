import React, { useEffect, useState } from "react";
import { matchSorter } from "match-sorter";

import { getExercisesFromIdArray } from "../../api-lib/fetchers";
import { ExerciseHistoryMap } from "./ProgressTile";
import { Exercise, Workout } from "../../types/interfaces";

interface Props {
  exerciseMap: ExerciseHistoryMap;
  searchTerm: string;
  selectedExerciseId: string;
  handleExerciseClick: (exercise: Exercise, workout?: Workout) => void;
}

const ChartExerciseOptions: React.FC<Props> = ({
  exerciseMap,
  searchTerm,
  selectedExerciseId,
  handleExerciseClick,
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const getExercises = async () => {
    const exerciseNames = await getExercisesFromIdArray([...exerciseMap.keys()]);
    setExercises(exerciseNames);
  };

  useEffect(() => {
    getExercises();
  }, [exerciseMap]);

  return (
    <>
      {matchSorter(exercises, searchTerm, {
        keys: ["name", "muscleWorked", "muscleGroup", "metric", "equipment"],
      }).map((exercise) => (
        <li
          key={exercise._id}
          onClick={() => handleExerciseClick(exercise)}
          className={`option ${exercise._id === selectedExerciseId && "highlight"}`}
        >
          <p>{exercise.name}</p>
        </li>
      ))}
    </>
  );
};

export default ChartExerciseOptions;
