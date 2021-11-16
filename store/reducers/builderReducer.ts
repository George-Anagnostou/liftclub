import { Workout, Routine, Team } from "../../types/interfaces";

interface AppState {
  workouts: { saved: Workout[] | undefined; created: Workout[] | undefined };
  routines: { created: Routine[] | undefined };
  teams: { created: Team[] | undefined };
}

export default function builderReducer(state: AppState, action) {
  const { type, payload } = action;

  switch (type) {
    case "UPDATE_ALL_CREATED_WORKOUTS":
      return { ...state, workouts: { ...state.workouts, created: payload.workouts } };
    case "UPDATE_ALL_SAVED_WORKOUTS":
      return { ...state, workouts: { ...state.workouts, saved: payload.workouts } };
    case "DELETE_CREATED_WORKOUT":
      return {
        ...state,
        workouts: {
          ...state.workouts,
          created:
            state.workouts.created?.filter((workout) => workout._id !== payload.workout_id) || [],
        },
      };
    case "ADD_CREATED_WORKOUT":
      return {
        ...state,
        workouts: {
          ...state.workouts,
          created: [payload.workout, ...(state.workouts.created || [])],
        },
      };

    case "UPDATE_CREATED_WORKOUT":
      if (!state.workouts.created) return { ...state };

      const workoutIndex = state.workouts.created.findIndex(
        (workout) => workout._id === payload.workout._id
      );
      state.workouts.created[workoutIndex] = payload.workout;

      return { ...state };

    case "UPDATE_ALL_CREATED_ROUTINES":
      return { ...state, routines: { ...state.routines, created: payload.routines } };

    case "ADD_CREATED_ROUTINE":
      return {
        ...state,
        routines: {
          ...state.routines,
          created: [payload.routine, ...(state.routines.created || [])],
        },
      };

    case "UPDATE_CREATED_ROUTINE":
      if (!state.routines.created) return { ...state };

      const routineIndex = state.routines.created.findIndex(
        (routine) => routine._id === payload.routine._id
      );
      state.routines.created[routineIndex] = payload.routine;

      return { ...state };

    case "DELETE_CREATED_ROUTINE":
      const newCreatedRoutines =
        state.routines.created && state.routines.created.length > 1
          ? state.routines.created.filter((each) => each._id !== payload.routine_id)
          : undefined;

      return {
        ...state,
        routines: { ...state.routines, created: newCreatedRoutines },
      };

    case "UPDATE_ALL_CREATED_TEAMS":
      return { ...state, teams: { ...state.teams, created: payload.teams } };

    case "ADD_CREATED_TEAM":
      return {
        ...state,
        teams: {
          ...state.teams,
          created: [payload.team, ...(state.teams.created || [])],
        },
      };

    case "UPDATE_CREATED_TEAM":
      if (!state.teams.created) return { ...state };

      const teamIndex = state.teams.created.findIndex((team) => team._id === payload.team._id);
      state.teams.created[teamIndex] = payload.team;

      return { ...state };

    case "DELETE_CREATED_TEAM":
      const newCreatedTeams =
        state.teams.created && state.teams.created.length > 1
          ? state.teams.created.filter((each) => each._id !== payload.team_id)
          : null;

      return {
        ...state,
        teams: { ...state.teams, created: newCreatedTeams },
      };

    default:
      throw new Error();
  }
}
