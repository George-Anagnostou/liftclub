import {
  getUserMadeWorkouts,
  getWorkoutsFromIdArray,
  postNewWorkout,
  deleteWorkout,
  updateExistingWorkout,
  getRoutinesFromCreatorId,
  deleteRoutine,
  postNewRoutine,
  updateRoutine,
  getUserMadeTeams,
  deleteTeam,
  postNewTeam,
  updateTeam,
} from "../../api-lib/fetchers";
import { NewTeam, NewWorkout, Routine, Team, User, Workout } from "../../types/interfaces";

// Workouts

export const getUserCreatedWorkouts = async (dispatch, user_id: string) => {
  const workouts = await getUserMadeWorkouts(user_id);
  dispatch({ type: "UPDATE_ALL_CREATED_WORKOUTS", payload: { workouts } });
};

export const getUserSavedWorkouts = async (dispatch, idArr: string[]) => {
  if (idArr.length === 0) return;
  const workouts = await getWorkoutsFromIdArray(idArr);
  dispatch({ type: "UPDATE_ALL_SAVED_WORKOUTS", payload: { workouts } });
};

export const addWorkoutToCreatedWorkouts = async (dispatch, workout: NewWorkout) => {
  const workout_id = await postNewWorkout(workout);

  if (workout_id) {
    workout["_id"] = workout_id;
    dispatch({ type: "ADD_CREATED_WORKOUT", payload: { workout } });
    return true;
  } else {
    return false;
  }
};

export const deleteWorkoutFromCreatedWorkouts = async (dispatch, workout_id: string) => {
  const deleted = await deleteWorkout(workout_id);
  if (deleted) dispatch({ type: "DELETE_CREATED_WORKOUT", payload: { workout_id } });
  return deleted;
};

export const updateExistingCreatedWorkout = async (dispatch, workout: Workout) => {
  const saveStatus = await updateExistingWorkout(workout);
  if (saveStatus) dispatch({ type: "UPDATE_CREATED_WORKOUT", payload: { workout } });
  return saveStatus;
};

// Routines

export const getUserCreatedRoutines = async (dispatch, user_id: string) => {
  const routines = await getRoutinesFromCreatorId(user_id);
  if (routines) dispatch({ type: "UPDATE_ALL_CREATED_ROUTINES", payload: { routines } });
};

export const deleteRoutineFromCreatedRoutines = async (dispatch, routine_id: string) => {
  const deleted = await deleteRoutine(routine_id);
  if (deleted) dispatch({ type: "DELETE_CREATED_ROUTINE", payload: { routine_id } });
  return deleted;
};

export const addRoutineToCreatedRoutines = async (dispatch, routine: Routine, user: User) => {
  const { _id, ...newRoutine } = routine;
  newRoutine.creator_id = user._id;
  newRoutine.creatorName = user.username;
  newRoutine.name = routine.name || "New Routine";

  const routine_id = await postNewRoutine(newRoutine);

  if (routine_id) {
    newRoutine["_id"] = routine_id;
    dispatch({ type: "ADD_CREATED_ROUTINE", payload: { routine: newRoutine } });
    return true;
  } else {
    return false;
  }
};

export const updateExistingCreatedRoutine = async (dispatch, routine: Routine) => {
  const saveStatus = await updateRoutine(routine);
  if (saveStatus) dispatch({ type: "UPDATE_CREATED_ROUTINE", payload: { routine } });
  return saveStatus;
};

// Teams

export const getUserCreatedTeams = async (dispatch, user_id: string) => {
  const teams = await getUserMadeTeams(user_id);
  if (teams) dispatch({ type: "UPDATE_ALL_CREATED_TEAMS", payload: { teams } });
};

export const deleteTeamFromCreatedTeams = async (dispatch, team_id: string) => {
  const deleted = await deleteTeam(team_id);
  if (deleted) dispatch({ type: "DELETE_CREATED_TEAM", payload: { team_id } });
  return deleted;
};

export const addTeamToCreatedTeams = async (dispatch, newTeam: NewTeam) => {
  const team_id = await postNewTeam(newTeam);

  if (team_id) {
    newTeam["_id"] = team_id;
    dispatch({ type: "ADD_CREATED_TEAM", payload: { team: newTeam } });
  }
  return team_id;
};

export const updateExistingCreatedTeam = async (dispatch, team: Team) => {
  const saveStatus = await updateTeam(team);
  if (saveStatus) dispatch({ type: "UPDATE_CREATED_TEAM", payload: { team } });
  return saveStatus;
};
