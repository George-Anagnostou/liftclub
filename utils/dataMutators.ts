import { getExercisesFromIdArray } from "../api-lib/fetchers";
import { ExerciseHistoryMap } from "../components/userProfile/ProgressTile";
import {
  Routine,
  RoutineWorkoutPlanForCalendar,
  Workout,
  WorkoutLog,
  WorkoutLogItem,
} from "../types/interfaces";

export const addExerciseDataToLoggedWorkout = async (logItem: WorkoutLogItem) => {
  logItem = JSON.parse(JSON.stringify(logItem));
  // Grab all exercise_ids from the workout
  const idArr = logItem.exerciseData.map((each) => each.exercise_id);
  // Get all exercise information
  const exerciseData = await getExercisesFromIdArray(idArr);
  // Create exercise key in each exercise to hold exercise data
  logItem.exerciseData.map((each, i) => (each.exercise = exerciseData[i]));
  return logItem;
};

export const addExerciseDataToWorkout = async (workout: Workout) => {
  workout = JSON.parse(JSON.stringify(workout));
  // Grab all the exercise_ids from the workout
  const idArr = workout.exercises.map((each) => each.exercise_id);
  // Query for exercise data using the idArr
  const exerciseData = await getExercisesFromIdArray(idArr);
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
  const res: RoutineWorkoutPlanForCalendar = {};

  plan.map((day) => {
    res[day.isoDate.substring(0, 10)] = {
      workout_id: day.workout_id,
      workout: day.workout,
    };
  });

  return res;
};

/**
 *
 * @param log User workout log
 * @returns a Map() where the keys are exercise id's and the values are arrays of all exercise sets that have been logged to the exercise and sorted by most recent date
 */
export const groupWorkoutLogByExercise = (log: WorkoutLog) => {
  const group: ExerciseHistoryMap = new Map();

  for (let [date, { exerciseData }] of Object.entries(log)) {
    exerciseData.forEach(({ exercise_id, sets }) => {
      const curr = group.get(exercise_id);
      if (curr) {
        group.set(exercise_id, [{ date: date, sets: sets, exercise_id }, ...curr]);
      } else {
        group.set(exercise_id, [{ date: date, sets: sets, exercise_id }]);
      }
    });
  }

  // Sort all exercise history's by date (newest to oldest)
  for (let [exercise_id, exerciseHistory] of [...group.entries()]) {
    group.set(
      exercise_id,
      exerciseHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }

  return group;
};

export const hasEnteredWeight = (weight: string | number) => {
  return typeof weight === "number" && weight >= 0;
};

/**
 *
 * @param sets
 * @returns a true if all sets in an exercise are filled in with a number, otherwise false
 */
export const setsAreComplete = (sets: { reps: number; weight: string | number }[]) => {
  return sets.every(({ weight }) => hasEnteredWeight(weight));
};
