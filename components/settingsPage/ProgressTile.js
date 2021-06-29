import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import WorkoutSelect from "./WorkoutSelect";
import ExerciseSelect from "./ExerciseSelect";
import Chart from "./Chart";
import StatButtons from "./StatButtons";
// Utils
import { getWorkoutsFromIdArray } from "../../utils/api";
import { addExerciseDataToLoggedWorkout, round } from "../../utils";
// Context
import { useStoreState } from "../../store";

export default function ProgressTile() {
  const { user } = useStoreState();

  const [workoutOptions, setWorkoutOptions] = useState([]); // Used in WorkoutSelect
  const [exerciseOptions, setExerciseOptions] = useState([]); // Exercise id and name options in Exercise Select
  const [filteredWorkouts, setFilteredWorkouts] = useState([]); // Workouts that match workout selected
  const [statOption, setStatOption] = useState("avgWeight"); // Stat to chart
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [chartData, setChartData] = useState([{ date: "", value: 0 }]);

  /**
   * 1. Set workout options to workouts that the user has logged
   */
  useEffect(() => {
    if (user) getWorkoutOptions();
  }, [user]);

  const getWorkoutOptions = async () => {
    const idArr = user.workoutLog.map((each) => each.workout_id);
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
    const options = workout.exerciseData.map(({ exercise }) => {
      return { exercise_id: exercise._id, exerciseName: exercise.name };
    });

    setExerciseOptions(options);
  };

  /**
   *
   * @param {string} targetExId for exercise to chart
   * @param {string} stat to chart
   */
  const chartExercise = (targetExId, stat) => {
    // Data to send as prop to chart component
    const data = [];

    // Days without weight added by user (-1 weight) is replaced by 0
    const formatWeight = (item) => (item.weight >= 0 ? item.weight : 0);

    // Format date for X axis labels
    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      return date.getMonth() + 1 + "/" + date.getDate();
    };

    const avgWeight = (sets) =>
      round(sets.reduce((a, b) => a + formatWeight(b) || 0, 0) / sets.length, 1);

    const totalWeight = (sets) => sets.reduce((a, b) => a + formatWeight(b) || 0, 0);

    const maxWeight = (sets) => Math.max(...sets.map((a) => formatWeight(a)));

    filteredWorkouts.map(({ exerciseData, isoDate }) => {
      return exerciseData.map(({ exercise_id, sets }) => {
        if (exercise_id === targetExId) {
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
    selectedExerciseId ? chartExercise(selectedExerciseId, statOption) : setChartData(null);
  }, [selectedExerciseId, statOption]);

  /**
   * Input handlers
   */
  const handleWorkoutOptionChange = (e) => {
    setExerciseOptions([]);
    setSelectedExerciseId(null);
    // Filter all workouts that match the id selected
    const filtered = user.workoutLog.filter((workout) => workout.workout_id === e.target.value);
    setFilteredWorkouts(filtered);
  };

  const handleExerciseOptionChange = (e) => setSelectedExerciseId(e.target.value);

  return (
    <Container>
      <h3 className="title">Progression</h3>

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

      <StatButtons setStatOption={setStatOption} statOption={statOption} />

      <Chart data={chartData} />
    </Container>
  );
}

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
  justify-content: space-between;
  padding: 0.5rem;

  select {
    width: 48%;
    &:first-child {
      margin-right: 0.25rem;
    }
  }
`;
