import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
// Components
import Chart from "./Chart";
import ChartStatButtons from "./ChartStatButtons";
import ExerciseStats from "./ExerciseStats";
import ChartSearchBox from "./ChartSearchBox";
import ChartExerciseOptions from "./ChartExerciseOptions";
import ChartWorkoutOptions from "./ChartWorkoutOptions";
// Utils
import { round, groupWorkoutLogByExercise, formatSetWeight } from "../../utils";
// Interfaces
import { Exercise, Set, User, Workout } from "../../types/interfaces";

export type ExerciseHistoryMap = Map<string, { sets: Set[]; date: string; exercise_id: string }[]>;

interface Props {
  profileData: User;
}

export type ChartData = {
  date: string;
  lbs: number;
}[];

const ProgressTile: React.FC<Props> = ({ profileData }) => {
  const [exerciseMap, setExerciseMap] = useState<ExerciseHistoryMap>(new Map());

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
  const [chartData, setChartData] = useState<ChartData>([]);
  const [statOption, setStatOption] = useState<"avgWeight" | "totalWeight" | "maxWeight">(
    "avgWeight"
  );

  const resetTileState = () => {
    setSearchTerm("");
    setSelectedExercise(undefined);
    setSelectedExerciseId("");
    setSelectedWorkoutId("");
    setChartData([]);
    setStatOption("avgWeight");
  };

  useEffect(() => {
    if (profileData.workoutLog) {
      resetTileState();
      setExerciseMap(groupWorkoutLogByExercise(profileData.workoutLog));
    }
  }, [profileData.workoutLog]);

  const getAvgWeight = useMemo(
    () => (sets: Set[]) =>
      round(
        sets.reduce((a, curr) => a + formatSetWeight(curr.weight) * curr.reps, 0) /
          sets.reduce((a, curr) => a + curr.reps, 0),
        1 // rounding precision
      ) || 0, // default
    []
  );

  const getTotalWeight = useMemo(
    () => (sets: Set[]) => sets.reduce((a, b) => a + formatSetWeight(b.weight) * b.reps || 0, 0),
    []
  );

  const getMaxWeight = useMemo(
    () => (sets: Set[]) => Math.max(0, ...sets.map((a) => formatSetWeight(a.weight))), // The 0 after .max is to prevent -Infinity
    []
  );

  // Trigger if the selected exercise changes or a stat option is selected
  useEffect(() => {
    if (selectedExerciseId) chartExercise(selectedExerciseId, selectedWorkoutId);
  }, [statOption]);

  const chartExercise = (exercise_id: string, workout_id?: string) => {
    const exerciseHistory = exerciseMap.get(exercise_id);
    if (!exerciseHistory) return;

    setSelectedWorkoutId(workout_id || "");
    setSelectedExerciseId(exerciseHistory[0].exercise_id);

    // Data to send as prop to chart component
    const exerciseChartData: ChartData = [];

    // Format date for X axis labels
    const formatDate = (isoDate: string) => {
      const date = new Date(isoDate);
      return date.getMonth() + 1 + "/" + (date.getDate() + 1);
    };

    exerciseHistory.forEach(({ date, sets }) => {
      if (workout_id) {
        const isQueriedWorkout = profileData.workoutLog[date].workout_id === workout_id;
        if (!isQueriedWorkout) return;
      }
      switch (statOption) {
        case "avgWeight":
          exerciseChartData.unshift({ date: formatDate(date), lbs: getAvgWeight(sets) });
          break;
        case "totalWeight":
          exerciseChartData.unshift({ date: formatDate(date), lbs: getTotalWeight(sets) });
          break;
        case "maxWeight":
          exerciseChartData.unshift({ date: formatDate(date), lbs: getMaxWeight(sets) });
          break;
      }
    });

    setChartData(exerciseChartData);
  };

  const handleExerciseClick = (exercise: Exercise, workout?: Workout) => {
    chartExercise(exercise._id, workout?._id);
    setSelectedExercise(exercise);
  };

  return (
    <Container>
      <h3 className="title">Progression</h3>

      <Collapsable style={chartData.length ? { height: "455px" } : { height: "0px" }}>
        <h3 className="name">{selectedExercise?.name}</h3>

        <Chart data={chartData} statOption={statOption} />

        <ChartStatButtons setStatOption={setStatOption} statOption={statOption} />

        {selectedExercise && (
          <ExerciseStats
            exercise={selectedExercise}
            exerciseHistory={exerciseMap.get(selectedExercise._id)!}
          />
        )}
      </Collapsable>

      <ChartSearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <SearchResults style={searchTerm ? {} : { display: "none" }}>
        <ChartExerciseOptions
          exerciseMap={exerciseMap}
          searchTerm={searchTerm}
          selectedExerciseId={selectedExerciseId}
          handleExerciseClick={handleExerciseClick}
        />

        <ChartWorkoutOptions
          profileData={profileData}
          searchTerm={searchTerm}
          selectedExerciseId={selectedExerciseId}
          selectedWorkoutId={selectedWorkoutId}
          setSelectedWorkoutId={setSelectedWorkoutId}
          handleExerciseClick={handleExerciseClick}
        />
      </SearchResults>
    </Container>
  );
};
export default ProgressTile;

const Collapsable = styled.section`
  width: 100%;
  overflow: hidden;
  transition: height 0.25s ease-out;
  transform-origin: top;

  .name {
    min-height: 30px;
    max-height: 65px;
    text-transform: capitalize;
    font-weight: 300;
    margin-left: 0.5rem;

    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    display: block;
  }
`;

const SearchResults = styled.ul`
  margin-top: 0.25rem;
  max-height: 40vh;
  width: 100%;
  border-radius: 5px;
  background: ${({ theme }) => theme.buttonMed};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 8px 15px ${({ theme }) => theme.boxShadow};
  z-index: 9999;
  overflow-x: hidden;
  overflow-y: scroll;

  p {
    text-transform: capitalize;
    font-weight: 200;
    transition: all 0.5s ease;
    width: fit-content;
    padding: 0.25rem 0;
  }

  .option {
    margin: 0.5rem 1rem;

    &:not(:last-child) {
      padding: 0 0 0.5rem;
      border-bottom: 1px solid ${({ theme }) => theme.buttonLight};
    }

    &.highlight p {
      background: ${({ theme }) => theme.accentSoft} !important;
      color: ${({ theme }) => theme.accentText} !important;
      border-radius: 5px;
      padding: 0.25rem 1rem;
    }
  }
`;

const Container = styled.section`
  position: relative;
  background: ${({ theme }) => theme.background};
  width: 100%;
  padding: 0.5rem;
  border-radius: 10px;
  text-align: left;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;
