import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
// Utils
import { getWorkoutsFromIdArray } from "../utils/api";
import { addExerciseDataToLoggedWorkout, round } from "../utils";
// Context
import { useStoreState } from "../store";
import WorkoutSelect from "../components/myProfile/WorkoutSelect";
import ExerciseSelect from "../components/myProfile/ExerciseSelect";
import Chart from "../components/myProfile/chart";

export default function myProfile() {
  const { user } = useStoreState();

  const [workoutOptions, setWorkoutOptions] = useState([]); // Used in WorkoutSelect
  const [workoutsSelected, setWorkoutsSelected] = useState([]); // Workouts that match workout selected
  const [exerciseOptions, setExerciseOptions] = useState([]); // Exercise id and name options in Exercise Select
  const [statOption, setStatOption] = useState("avgWeight"); // Stat to chart
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [chartData, setChartData] = useState(null);

  const handleWorkoutOptionChange = (e) => {
    // Filter all workouts that match the id selected
    const filtered = user.workoutLog.filter((workout) => workout.workout_id === e.target.value);
    setWorkoutsSelected(filtered);
  };

  const handleExerciseOptionChange = (e) => {
    setSelectedExerciseId(e.target.value);
  };

  const handleStatOptionChange = (e) => setStatOption(e.target.value);

  const chartExercise = (targetId, stat = "avgWeight") => {
    const getAvgWeight = (sets) =>
      round(sets.reduce((a, b) => a + b.weight || 0, 0) / sets.length, 1);

    const getTotalWeight = (sets) => sets.reduce((a, b) => a + b.weight || 0, 0);

    const getMaxWeight = (sets) => Math.max(...sets.map((a) => a.weight));

    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      return date.getMonth() + 1 + "/" + date.getDate();
    };

    const data = [];

    workoutsSelected.map(({ exerciseData, isoDate }) => {
      return exerciseData.map(({ exercise_id, sets }) => {
        if (exercise_id === targetId) {
          switch (stat) {
            case "avgWeight":
              data.push({ date: formatDate(isoDate), value: getAvgWeight(sets) });
              break;
            case "totalWeight":
              data.push({ date: formatDate(isoDate), value: getTotalWeight(sets) });
              break;
            case "maxWeight":
              data.push({ date: formatDate(isoDate), value: getMaxWeight(sets) });
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

  const getExerciseOptions = async () => {
    // Only need to get the exercise data once
    const workout = await addExerciseDataToLoggedWorkout(workoutsSelected[0]);

    // exerciseOptions is an arr of {exercise_id, exerciseName}
    const options = workout.exerciseData.map(({ exercise }) => {
      return { exercise_id: exercise._id, exerciseName: exercise.name };
    });

    setExerciseOptions(options);
  };

  const getWorkoutOptions = async () => {
    const idArr = user.workoutLog.map((each) => each.workout_id);
    // Returns all unique workouts
    const workouts = await getWorkoutsFromIdArray(idArr);
    setWorkoutOptions(workouts);
  };

  // Trigger when user selects a workout
  useEffect(() => {
    if (workoutsSelected.length) getExerciseOptions();
  }, [workoutsSelected]);

  // Get workout options on mount
  useEffect(() => {
    if (user) getWorkoutOptions();
  }, [user]);

  return (
    <Layout>
      <ProfileContainer>
        <h2>Your profile</h2>
        {user ? (
          <>
            <Heading>
              <p>
                username: <span>{user.username}</span>
              </p>
              <p>
                account type: <span>{user.isAdmin ? "Admin" : "Member"}</span>
              </p>
            </Heading>

            <SelectContainer>
              <div>
                <p>Select a workout:</p>
                <WorkoutSelect
                  workoutOptions={workoutOptions}
                  handleWorkoutOptionChange={handleWorkoutOptionChange}
                />
              </div>

              <div>
                <p>Select an exercise:</p>
                <ExerciseSelect
                  exerciseOptions={exerciseOptions}
                  handleExerciseOptionChange={handleExerciseOptionChange}
                />
              </div>
            </SelectContainer>

            <Buttons>
              <button
                onClick={handleStatOptionChange}
                value="avgWeight"
                style={statOption === "avgWeight" ? { background: "#eaeeff" } : null}
              >
                Average Weight
              </button>
              <button
                onClick={handleStatOptionChange}
                value="totalWeight"
                style={statOption === "totalWeight" ? { background: "#eaeeff" } : null}
              >
                Total Weight
              </button>
              <button
                onClick={handleStatOptionChange}
                value="maxWeight"
                style={statOption === "maxWeight" ? { background: "#eaeeff" } : null}
              >
                Max Weight
              </button>
            </Buttons>

            {chartData && <Chart data={chartData} />}
          </>
        ) : (
          <LoadingSpinner />
        )}
      </ProfileContainer>
    </Layout>
  );
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Heading = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  font-size: 0.7rem;

  span {
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const SelectContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;

  div {
    width: 48%;
    padding: 0.5rem 0;
    border-radius: 5px;
    border: none;

    &:first-child {
      margin-right: 0.25rem;
    }

    select {
      max-width: 90%;
      text-transform: capitalize;
    }
  }
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
  button {
    flex: 1;
    cursor: pointer;
    margin: 0.5rem;
    padding: 0.2rem 0.5rem;
    border-radius: 5px;
    border: none;

    &:hover {
      background: #eaeeff;
    }
  }
`;
