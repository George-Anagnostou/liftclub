import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import WorkoutSelect from "./WorkoutSelect";
import ExerciseSelect from "./ExerciseSelect";
import Chart from "./Chart";
import StatButtons from "./StatButtons";
// Utils
import { getWorkoutsFromIdArray } from "../../utils/api";
import { addExerciseDataToLoggedWorkout, round } from "../../utils";
// Interfaces
import { User, Workout, WorkoutLogItem } from "../../utils/interfaces";

interface Props {
  profileData: User;
}

const ProgressTile: React.FC<Props> = ({ profileData }) => {
  const [workoutOptions, setWorkoutOptions] = useState<Workout[]>([]); // Used in WorkoutSelect
  const [exerciseOptions, setExerciseOptions] = useState<
    { exercise_id: string; exerciseName: string }[]
  >([]); // Used in ExerciseSelect
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutLogItem[]>([]); // Workouts from profileData.workoutLog that match workout selected
  const [statOption, setStatOption] = useState<"avgWeight" | "totalWeight" | "maxWeight">(
    "avgWeight"
  ); // Stat to chart
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>([]);

  const resetTileState = () => {
    setChartData([]);
    setSelectedExerciseId(null);
    setStatOption("avgWeight");
    setFilteredWorkouts([]);
    setExerciseOptions([]);
  };

  /**
   * 1. Set workout options to workouts that the profile has logged
   */
  useEffect(() => {
    if (profileData) {
      resetTileState();
      getWorkoutOptions();
    }
  }, [profileData]);

  const getWorkoutOptions = async () => {
    const keyArr = Object.keys(profileData.workoutLog);
    const idArr = keyArr.map((key) => profileData.workoutLog[key].workout_id);
    // Returns all unique workouts
    const workouts = await getWorkoutsFromIdArray(idArr);
    setWorkoutOptions(workouts);
  };

  /**
   * 2. Once user selects a workout, get the exercise options from that workout
   */
  useEffect(() => {
    if (filteredWorkouts.length) getExerciseOptions();
  }, [filteredWorkouts]);

  const getExerciseOptions = async () => {
    // Only need to use one workout to get the exercise ids and names
    const workout = await addExerciseDataToLoggedWorkout(filteredWorkouts[0]);

    // exerciseOptions is an arr of {exercise_id, exerciseName}
    const options = workout.exerciseData.map(({ exercise }) => ({
      exercise_id: exercise!._id,
      exerciseName: exercise!.name,
    }));

    setExerciseOptions(options);
    setSelectedExerciseId(options[0].exercise_id);
  };

  /**
   *
   * @param {string} targetExId for exercise to chart
   * @param {string} stat to chart
   */
  const chartExercise = (targetExId: string, stat: "avgWeight" | "totalWeight" | "maxWeight") => {
    // Define Sets type
    type Set = {
      reps: number;
      weight: string | number;
    };

    // Data to send as prop to chart component
    const data: { date: string; value: number }[] = [];

    // Days without weight added by user (-1 weight) is replaced by 0
    const formatWeight = (item: Set) => (item.weight >= 0 ? Number(item.weight) : 0);

    // Format date for X axis labels
    const formatDate = (isoDate: string) => {
      const date = new Date(isoDate);
      return date.getMonth() + 1 + "/" + date.getDate();
    };

    const avgWeight = (sets: Set[]) =>
      round(sets.reduce((a, b) => a + formatWeight(b) || 0, 0) / sets.length, 1);

    const totalWeight = (sets: Set[]) => sets.reduce((a, b) => a + formatWeight(b) || 0, 0);

    const maxWeight = (sets: Set[]) => Math.max(...sets.map((a) => formatWeight(a)));

    filteredWorkouts.map(({ exerciseData, isoDate }) => {
      return exerciseData.map(({ exercise_id, sets }) => {
        if (exercise_id === targetExId && isoDate) {
          switch (stat) {
            case "avgWeight":
              data.push({ date: formatDate(isoDate), value: avgWeight(sets) });
              break;
            case "totalWeight":
              data.push({ date: formatDate(isoDate), value: totalWeight(sets) });
              break;
            case "maxWeight":
              data.push({ date: formatDate(isoDate), value: maxWeight(sets) });
              break;
          }
        }
      });
    });

    setChartData(data);
  };

  // Trigger if the selected exercise changes or a stat option is selected
  useEffect(() => {
    selectedExerciseId ? chartExercise(selectedExerciseId, statOption) : setChartData([]);
  }, [selectedExerciseId, statOption]);

  /**
   * Input handlers
   */
  const handleWorkoutOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetWorkout_id = e.target.value;

    setExerciseOptions([]);
    setSelectedExerciseId(null);

    // Filter all workouts that match the id selected
    const keyArr = Object.keys(profileData.workoutLog);
    let filtered = keyArr
      .filter((key) => profileData.workoutLog[key].workout_id === targetWorkout_id)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((key) => {
        profileData.workoutLog[key].isoDate = key;
        return profileData.workoutLog[key];
      });

    if (filtered && filtered.length) {
      setFilteredWorkouts(filtered);
    }
  };

  const handleExerciseOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExerciseId(e.target.value);
  };

  return (
    <Container>
      <h3 className="title">Progression</h3>

      <StatButtons setStatOption={setStatOption} statOption={statOption} />

      <Chart data={chartData} />

      <SelectContainer>
        <WorkoutSelect
          workoutOptions={workoutOptions}
          handleWorkoutOptionChange={handleWorkoutOptionChange}
        />

        <ExerciseSelect
          exerciseOptions={exerciseOptions}
          handleExerciseOptionChange={handleExerciseOptionChange}
        />
      </SelectContainer>
    </Container>
  );
};
export default ProgressTile;

const Container = styled.section`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 0.5rem;
  border-radius: 10px;
  text-align: left;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const SelectContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem;

  select {
    width: 90%;
    text-transform: capitalize;
    margin: 0.25rem 0;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    border: none;
    border-radius: 5px;
    color: ${({ theme }) => theme.text};
    box-shadow: 0 1px 2px ${({ theme }) => theme.boxShadow};

    --BG: ${({ theme }) => theme.buttonMed};
    --arrow: ${({ theme }) => theme.accentSoft};
    --arrowBG: ${({ theme }) => theme.buttonLight};

    width: 100%;
    -webkit-appearance: none;
    appearance: none;

    background-color: ${({ theme }) => theme.buttonMed};
    background-image: linear-gradient(var(--BG), var(--BG)),
      linear-gradient(-135deg, transparent 50%, var(--arrowBG) 50%),
      linear-gradient(-225deg, transparent 50%, var(--arrowBG) 50%),
      linear-gradient(var(--arrowBG) 42%, var(--arrow) 42%);
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
    background-size: 1px 100%, 20px 22px, 20px 22px, 20px 100%;
    background-position: right 20px center, right bottom, right bottom, right bottom;

    &:disabled {
      opacity: 0.5;
      box-shadow: none;
    }
  }
`;
