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
import Chart from "../components/myProfile/Chart";

export default function myProfile() {
  const { user } = useStoreState();

  const [workoutOptions, setWorkoutOptions] = useState([]); // Used in WorkoutSelect
  const [filteredWorkouts, setFilteredWorkouts] = useState([]); // Workouts that match workout selected
  const [exerciseOptions, setExerciseOptions] = useState([]); // Exercise id and name options in Exercise Select
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
    const avgWeight = (sets) => round(sets.reduce((a, b) => a + b.weight || 0, 0) / sets.length, 1);

    const totalWeight = (sets) => sets.reduce((a, b) => a + b.weight || 0, 0);

    const maxWeight = (sets) => Math.max(...sets.map((a) => a.weight));

    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      return date.getMonth() + 1 + "/" + date.getDate();
    };

    const data = [];

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

  const handleStatOptionChange = (e) => setStatOption(e.target.value);

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

            <Chart data={chartData} />
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
      width: 90%;
      text-transform: capitalize;
      padding: 0.5rem;
      margin-top: 0.25rem;
      border-radius: 5px;
      border: 1px solid #ccc;

      &:hover {
        background: #eaeeff;
      }
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
    border: 1px solid #ccc;

    &:hover {
      background: #eaeeff;
    }
  }
`;
