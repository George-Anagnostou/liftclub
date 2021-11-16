import { EditableTeam } from "../../components/builder/team";
import {
  Exercise,
  NewExercise,
  NewWorkout,
  Routine,
  NewRoutine,
  Team,
  User,
  ShortUser,
  Workout,
} from "../../types/interfaces";

/*
 *
 *
 *
 * USERS
 *
 *
 *
 */
export const getUserFromUsername = async (username: string): Promise<User | false> => {
  try {
    const res = await fetch(`/api/users/null?username=${username}`);
    const userData = await res.json();
    return userData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveProfileImgUrl = async (user_id: string, username: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ profileImgUrl: username }),
    });

    return res.status === 201;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveUserWeight = async (weight: number, user_id: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ weight }),
    });

    return res.status === 201;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveUserBio = async (user_id: string, bio: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ bio }),
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// Multiple
export const getUsersFromIdArr = async (idArr: string[]): Promise<ShortUser[] | false> => {
  try {
    const res = await fetch(`/api/users/queryMultiple`, {
      method: "POST",
      body: JSON.stringify({ idArr }),
    });

    const users = await res.json();
    return users;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// Queries
export const queryUsersByUsername = async (query: string): Promise<Team["trainers"] | false> => {
  try {
    const res = await fetch(`/api/users/searchUsername?query=${query}`, {
      method: "GET",
    });

    const users = await res.json();
    return users;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/*
 *
 *
 *
 * EXERCISES
 *
 *
 *
 */
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
    });

    return res.status === 201;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/*
 *
 *
 *
 * WORKOUTS
 *
 *
 *
 */
export const postNewWorkout = async (workout: NewWorkout) => {
  try {
    const res = await fetch(`/api/workouts`, {
      method: "POST",
      body: JSON.stringify(workout),
    });

    const workout_id = await res.json();

    return workout_id;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const updateExistingWorkout = async (workout: Workout) => {
  try {
    const res = await fetch(`/api/workouts/${workout._id}`, {
      method: "PUT",
      body: JSON.stringify(workout),
    });

    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const deleteWorkout = async (workout_id: string) => {
  try {
    const res = await fetch(`/api/workouts/${workout_id}`, {
      method: "DELETE",
    });

    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getWorkoutFromId = async (workout_id: string): Promise<Workout | false> => {
  try {
    const res = await fetch(`/api/workouts/${workout_id}`);

    const workoutData = await res.json();
    return workoutData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// Queries
export const getUserMadeWorkouts = async (user_id: string): Promise<Workout[]> => {
  try {
    const res = await fetch(`/api/workouts?creator_id=${user_id}`);

    const userMadeWorkouts = await res.json();

    // Reverse to get newest to front
    return userMadeWorkouts.reverse();
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getPublicWorkouts = async (): Promise<Workout[]> => {
  try {
    const res = await fetch("/api/workouts?isPublic=true");

    const publicWorkouts = await res.json();

    // Reverse to get newest to front
    return publicWorkouts.reverse();
  } catch (e) {
    console.log(e);
    return [];
  }
};

// Multiple
export const getWorkoutsFromIdArray = async (idArr: string[]): Promise<Workout[]> => {
  if (!Boolean(idArr.length)) return [];

  try {
    const res = await fetch("/api/workouts/queryMultiple", {
      method: "POST",
      body: JSON.stringify(idArr),
    });

    const workouts = await res.json();

    // Sort workouts to be in the same order that the irArr requests them
    workouts.sort(
      (a: Workout, b: Workout) => idArr.indexOf(a._id.toString()) - idArr.indexOf(b._id.toString())
    );

    return workouts;
  } catch (e) {
    console.log(e);
    return [];
  }
};

/*
 *
 *
 *
 * ROUTINES
 *
 *
 *
 */

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

/*
 *
 *
 *
 * TEAMS
 *
 *
 *
 */
export const getTeamById = async (team_id: string): Promise<Team | false> => {
  try {
    const res = await fetch(`/api/teams/${team_id}`);

    const team = await res.json();
    return team;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getUserMadeTeams = async (user_id: string): Promise<Team[] | false> => {
  try {
    const res = await fetch(`/api/teams?creator_id=${user_id}`);
    const teams = await res.json();

    return teams;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const addTrainerToTeam = async (team_id: string, trainer_id: string) => {
  try {
    const res = await fetch(`/api/teams/${team_id}?addTrainer=${trainer_id}`, { method: "PUT" });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const removeTrainerFromTeam = async (team_id: string, trainer_id: string) => {
  try {
    const res = await fetch(`/api/teams/${team_id}?removeTrainer=${trainer_id}`, { method: "PUT" });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// Multiple
export const getTeamsFromIdArray = async (idArr: string[]): Promise<Team[]> => {
  if (!Boolean(idArr.length)) return [];

  try {
    const res = await fetch("/api/teams/queryMultiple", {
      method: "POST",
      body: JSON.stringify(idArr),
    });

    const teams = await res.json();

    // Sort teams to be in the same order that the irArr requests them
    teams.sort(
      (a: Team, b: Team) => idArr.indexOf(a._id.toString()) - idArr.indexOf(b._id.toString())
    );

    return teams;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const postNewTeam = async (team: EditableTeam): Promise<Team["_id"] | false> => {
  try {
    const dbTeam = {
      teamName: team.teamName,
      members: [],
      dateCreated: new Date().toISOString(),
      creatorName: team.creatorName,
      creator_id: team.creator_id,
      trainers: team.trainers.map((trainer) => trainer._id),
      routine_id: team.routine_id,
    };

    const res = await fetch("/api/teams", {
      method: "POST",
      body: JSON.stringify(dbTeam),
    });

    const team_id = await res.json();
    return team_id;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const updateTeam = async (team: EditableTeam) => {
  try {
    const dbTeam = {
      _id: team._id,
      teamName: team.teamName,
      members: [...team.members],
      dateCreated: team.dateCreated,
      creatorName: team.creatorName,
      creator_id: team.creator_id,
      trainers: team.trainers.map((trainer) => trainer._id),
      routine_id: team.routine_id,
    };

    const res = await fetch(`/api/teams/${dbTeam._id}?updateTeam=true`, {
      method: "PUT",
      body: JSON.stringify(dbTeam),
    });

    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const deleteTeam = async (team_id: string) => {
  try {
    const res = await fetch(`/api/teams/${team_id}`, {
      method: "DELETE",
    });

    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getAllTeamsByMemberCount = async () => {
  try {
    const res = await fetch(`/api/teams/queryMultiple?sort=members`, {
      method: "GET",
    });

    const teams: Team[] = await res.json();

    return teams;
  } catch (e) {
    console.log(e);
    return false;
  }
};
