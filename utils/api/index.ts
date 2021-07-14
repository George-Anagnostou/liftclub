import { Exercise, Routine, Team, User, Workout, WorkoutLog, WorkoutLogItem } from "../interfaces";

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

export const userJoiningTeam = async (user_id: string, team_id: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ joinTeam: team_id }),
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const userLeavingTeam = async (user_id: string, team_id: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ leaveTeam: team_id }),
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const addUserSavedWorkout = async (user_id: string, workout_id: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ addSavedWorkout: workout_id }),
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const removeUserSavedWorkout = async (user_id: string, workout_id: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ removeSavedWorkout: workout_id }),
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveUserWorkoutLog = async (workoutLog: WorkoutLog, user_id: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ workoutLog }),
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

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const addFollow = async (user_id: string, followee_id: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ follow: followee_id }),
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const removeFollow = async (user_id: string, followee_id: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ unfollow: followee_id }),
    });

    return true;
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

// export const getUserSavedWorkouts = async (user_id) => {
//   try {
//     const res = await fetch(`/api/users/${user_id}?field=savedWorkouts`);
//     const workouts = await res.json();

//     return workouts;
//   } catch (e) {
//     console.log(e);
//   }
// };

export const getDateFromUserWorkoutLog = async (
  user_id: string,
  isoDate: string
): Promise<WorkoutLogItem | false> => {
  try {
    const res = await fetch(`/api/users/${user_id}?field=workoutLog&date=${isoDate}`);

    return res.status === 200 ? await res.json() : false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const deleteWorkoutFromWorkoutLog = async (user_id: string, isoDate: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}?field=workoutLog&date=${isoDate}`, {
      method: "DELETE",
    });

    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// Multiple
export const getUsersFromIdArr = async (idArr: string[]): Promise<User[] | false> => {
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

export const createExercise = async (exercise: Exercise) => {
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
export const postNewWorkout = async (workout: Workout) => {
  try {
    const res = await fetch(`/api/workouts`, {
      method: "POST",
      body: JSON.stringify(workout),
    });

    return res.status === 201;
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
export const postNewRoutine = async (newRoutine: Routine) => {
  try {
    const res = await fetch(`/api/routines}`, {
      method: "POST",
      body: JSON.stringify({ newRoutine }),
    });

    return res.status === 201;
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
