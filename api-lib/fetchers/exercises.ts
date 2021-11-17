import { Exercise, NewExercise } from "../../types/interfaces";
import { getHeaderToken } from "../auth/token";

export const getExercisesFromIdArray = async (idArr: string[]): Promise<Exercise[]> => {
  try {
    const res = await fetch("/api/exercises/queryMultiple", {
      method: "POST",
      body: JSON.stringify(idArr),
    });

    const exercises = await res.json();
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
