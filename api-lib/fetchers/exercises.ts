import { Exercise, NewExercise } from "../../types/interfaces";
import { getHeaderToken } from "../auth/token";

export const getExercisesFromIdArray = async (idArr: string[]) => {
  if (!Boolean(idArr.length)) return [];

  try {
    const res = await fetch("/api/exercises/queryMultiple", {
      method: "POST",
      body: JSON.stringify(idArr),
    });

    const exercises: Exercise[] = await res.json();
    return exercises;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getExerciseNamesFromIdArray = async (idArr: string[]) => {
  if (!Boolean(idArr.length)) return [];

  try {
    const res = await fetch("/api/exercises/names", {
      method: "POST",
      body: JSON.stringify(idArr),
    });

    const workouts: { _id: string; name: string }[] = await res.json();

    // Sort workouts to be in the same order that the irArr requests them
    workouts.sort((a, b) => idArr.indexOf(a._id.toString()) - idArr.indexOf(b._id.toString()));

    return workouts;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getExercisesByUserId = async (user_id: string) => {
  try {
    const res = await fetch(`/api/exercises?creator_id=${user_id}`);
    const exercises: Exercise[] = await res.json();
    return exercises;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const createExercise = async (exercise: NewExercise) => {
  try {
    const res = await fetch("/api/exercises", {
      method: "POST",
      body: JSON.stringify(exercise),
      headers: { token: getHeaderToken() },
    });

    return res.status === 201;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const deleteExercise = async (exercise_id: string) => {
  try {
    const res = await fetch(`/api/exercises?exercise_id=${exercise_id}`, {
      method: "DELETE",
      headers: { token: getHeaderToken() },
    });

    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};
