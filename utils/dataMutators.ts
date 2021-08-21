import { getExercisesFromIdArray } from "./api";
import { Routine, Workout, WorkoutLogItem } from "./interfaces";

export const addExerciseDataToLoggedWorkout = async (workout: WorkoutLogItem) => {
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

export const addExerciseDataToWorkout = async (workout: Workout) => {
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

export const moveItemInArray = (arr: any | undefined[], startIndex: number, endIndex: number) => {
  if (endIndex >= arr.length) {
    let k = endIndex - arr.length + 1;
    while (k--) arr.push(undefined);
  }
  arr.splice(endIndex, 0, arr.splice(startIndex, 1)[0]);
  return arr; // for testing
};

export const formatRoutineWorkoutPlanForCalendar = (plan: Routine["workoutPlan"]) => {
  const res = {};

  plan.map((day) => {
    res[day.isoDate.substring(0, 10)] = {
      workout_id: day.workout_id,
      workout: day.workout,
    };
  });

  return res;
};
