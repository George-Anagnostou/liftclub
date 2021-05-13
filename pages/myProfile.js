import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
// Utils
import { getWorkoutsFromIdArray } from "../utils/ApiSupply";
// Context
import { useStoreState, useStoreDispatch } from "../store";
import { addExerciseDataToLoggedWorkout } from "../utils/general";

function myProfile() {
  const dispatch = useStoreDispatch();
  const { user } = useStoreState();

  const [workoutOptions, setWorkoutOptions] = useState([]);
  const [workoutsToGraph, setWorkoutsToGraph] = useState([]);

  const getWorkoutOptions = async () => {
    const idArr = user.workoutLog.map((each) => each.workout_id);
    // Returns all unique workouts
    const workouts = await getWorkoutsFromIdArray(idArr);
    setWorkoutOptions(workouts);
  };

  const handleOptionChange = (e) => {
    const filtered = user.workoutLog.filter((workout) => workout.workout_id === e.target.value);
    setWorkoutsToGraph(filtered);
  };

  const graphWorkouts = async () => {
    const clone = [...workoutsToGraph];

    for (const workout of clone) {
      await addExerciseDataToLoggedWorkout(workout);
    }

    const data = clone.map(({ isoDate, exerciseData }) => {
      return {
        isoDate,
        exerciseData: exerciseData.map(({ exercise, sets }) => {
          return {
            exercise,
            sets,
            totalWeight: sets.reduce((a, b) => a + b.weight || 0, 0),
            totalReps: sets.reduce((a, b) => a + b.reps || 0, 0),
            avgWeight: sets.reduce((a, b) => a + b.weight || 0, 0) / sets.length,
            maxWeight: Math.max(...sets.map((a) => a.weight)),
          };
        }),
      };
    });

    console.log(data);
  };

  useEffect(() => {
    if (workoutsToGraph.length) graphWorkouts();
  }, [workoutsToGraph]);

  useEffect(() => {
    if (user) getWorkoutOptions();
  }, [user]);

  return (
    <Layout>
      <h2>Your profile</h2>
      {user ? (
        <div>
          <p>{user.username}</p>
          <p>Account type: {user.isAdmin ? "Admin" : "Member"}</p>
          <h2>Workouts you have done:</h2>

          <select name="workoutOptions" onChange={handleOptionChange} defaultValue="none">
            <option value="none" disabled>
              Select One
            </option>
            {workoutOptions.map((workout) => (
              <option value={workout._id} key={workout._id}>
                {workout.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </Layout>
  );
}

export default myProfile;
