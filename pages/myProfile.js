import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Components
import LoadingSpinner from "../components/LoadingSpinner";
import WorkoutSelect from "../components/myProfile/WorkoutSelect";
import ExerciseSelect from "../components/myProfile/ExerciseSelect";
import Chart from "../components/myProfile/Chart";
import StatButtons from "../components/myProfile/StatButtons";
import WeightInput from "../components/myProfile/WeightInput";
import ThemeToggle from "../components/Themes/ThemeToggle";
// Utils
import { getWorkoutsFromIdArray } from "../utils/api";
import { addExerciseDataToLoggedWorkout, round } from "../utils";
// Context
import { useStoreState, useStoreDispatch, logoutUser } from "../store";

export default function myProfile() {
  const dispatch = useStoreDispatch();
  const { user } = useStoreState();
  const router = useRouter();

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

  const handleLogoutClick = () => {
    logoutUser(dispatch);
    router.push("/");
  };

  return (
    <ProfileContainer>
      {user ? (
        <>
          <Heading>
            <div className="line">
              <p>Username:</p>
              <span>{user.username}</span>
            </div>
            <div className="line">
              <p>Account Type:</p>
              <span>{user.isAdmin ? "Admin" : "Member"}</span>
            </div>
            <div className="line">
              <p>Night Mode</p>
              <span>
                <ThemeToggle />
              </span>
            </div>
            <button onClick={handleLogoutClick}>sign out</button>
          </Heading>

          <WeightInput user={user} />

          <section>
            <h3>Progression</h3>

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
          </section>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </ProfileContainer>
  );
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 1rem 0.5rem;

  section {
    width: 100%;
    border-radius: 5px;
    background: ${({ theme }) => theme.background};
    margin: 0 1rem;
    padding: 0.5rem 0;
  }
`;

const Heading = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  width: 100%;
  padding: 0.5rem 1rem;
  position: relative;
  border-radius: 5px;
  background: ${({ theme }) => theme.background};

  .line {
    display: flex;
    align-items: flex-end;
    justify-content: center;

    margin: 0.5rem 0;
    height: 1.5rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.textLight};

    span {
      font-size: 1.35rem;
      font-weight: thin;
      margin-left: 1rem;
      color: ${({ theme }) => theme.text};
    }
  }

  button {
    position: absolute;
    top: 5px;
    right: 5px;
    border-radius: 4px;
    padding: 0.5rem;
    font-size: inherit;
    border: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.textLight};
    background: ${({ theme }) => theme.buttonMed};
  }
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
