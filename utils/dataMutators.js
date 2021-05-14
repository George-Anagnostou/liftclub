import { getExercisesFromIdArray } from "./api";

export const addExerciseDataToLoggedWorkout = async (workout) => {
  // Grab all exercise_ids from the workout
  const idArr = workout.exerciseData.map((each) => each.exercise_id);

  // Get all exercise information
  const exerciseData = await getExercisesFromIdArray(idArr);

  // Sort the array based on the order of the idArr
  exerciseData.sort((a, b) => idArr.indexOf(a._id) - idArr.indexOf(b._id));

  // Create exercise key in each exercise to hold exercise data
  workout.exerciseData.map((each, i) => (each.exercise = exerciseData[i]));

  return workout;
};

export const addExerciseDataToWorkout = async (workout) => {
  // Grab all the exercise_ids from the workout
  const idArr = workout.exercises.map((each) => each.exercise_id);

  // Query for exercise data using the idArr
  const exerciseData = await getExercisesFromIdArray(idArr);

  // Sort the array based on the order of the idArr
  exerciseData.sort((a, b) => idArr.indexOf(a._id) - idArr.indexOf(b._id));

  // Create exercise key in each exercise to hold exercise data
  workout.exercises.map((each, i) => (each.exercise = exerciseData[i]));

  return workout;
};
