import { Routine, NewRoutine } from "../../types/interfaces";

export const getRoutinesFromCreatorId = async (creator_id: string): Promise<Routine[] | false> => {
  try {
    const res = await fetch(`/api/routines/?creator_id=${creator_id}`);

    const routines = await res.json();

    return routines;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getRoutineFromId = async (routine_id: string): Promise<Routine | false> => {
  try {
    const res = await fetch(`/api/routines/${routine_id}`);

    const routineData = await res.json();

    return routineData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// *************** TODO ***************
export const postNewRoutine = async (newRoutine: NewRoutine): Promise<string | false> => {
  try {
    const res = await fetch(`/api/routines`, {
      method: "POST",
      body: JSON.stringify({ newRoutine }),
    });

    const routine_id = await res.json();
    return routine_id;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// *************** TODO ***************
export const updateRoutine = async (updatedRoutine: Routine) => {
  try {
    const res = await fetch(`/api/routines/${updatedRoutine._id}`, {
      method: "PUT",
      body: JSON.stringify({ updatedRoutine }),
    });

    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// *************** TODO ***************
export const deleteRoutine = async (routine_id: string) => {
  try {
    const res = await fetch(`/api/routines/${routine_id}`, {
      method: "DELETE",
    });

    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};