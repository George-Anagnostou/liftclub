import { Exercise, WorkoutLogItem } from "../interfaces";

/*
 *
 *
 *
 * USERS
 *
 *
 *
 */
export const getUserFromUsername = async (username) => {
  try {
    const res = await fetch(`/api/users/null?username=${username}`);
    const userData = await res.json();
    return userData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const userJoiningTeam = async (user_id, team_id) => {
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

export const userLeavingTeam = async (user_id, team_id) => {
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

export const addUserSavedWorkout = async (user_id, workout_id) => {
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

export const removeUserSavedWorkout = async (user_id, workout_id) => {
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

export const saveUserWorkoutLog = async (workoutLog, user_id) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ workoutLog }),
    });

    const userData = await res.json();
    return userData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveUserWeight = async (weight, user_id) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({ weight }),
    });

    const userData = await res.json();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const addFollow = async (user_id, followee_id) => {
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

export const removeFollow = async (user_id, followee_id) => {
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

export const saveUserBio = async (user_id, bio) => {
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

export const deleteWorkoutFromWorkoutLog = async (user_id: string, isoDate) => {
  try {
    const res = await fetch(`/api/users/${user_id}?field=workoutLog&date=${isoDate}`, {
      method: "DELETE",
    });
    const updatedLog = await res.json();
    return updatedLog;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// Multiple
export const getUsersFromIdArr = async (idArr) => {
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
export const getExercisesFromIdArray = async (idArr: string[]) => {
  try {
    const res = await fetch("/api/exercises/queryMultiple", {
      method: "POST",
      body: JSON.stringify(idArr),
    });

    const exercises = await res.json();
    return exercises;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const createExercise = async (exercise: Exercise) => {
  try {
    const res = await fetch("/api/exercises", {
      method: "POST",
      body: JSON.stringify(exercise),
    });

    return { status: res.status };
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
export const postNewWorkout = async (workout) => {
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

export const updateExistingWorkout = async (workout) => {
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

export const deleteWorkout = async (workout_id) => {
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

export const getWorkoutFromId = async (workout_id) => {
  try {
    const res = await fetch(`/api/workouts/${workout_id}`);

    const workoutData = await res.json();
    return workoutData;
  } catch (e) {
    console.log(e);
  }
};

// Queries
export const getUserMadeWorkouts = async (user_id) => {
  try {
    const res = await fetch(`/api/workouts?creator_id=${user_id}`);

    const userMadeWorkouts = await res.json();

    // Reverse to get newest to front
    return userMadeWorkouts.reverse();
  } catch (e) {
    console.log(e);
  }
};

export const getPublicWorkouts = async () => {
  try {
    const res = await fetch("/api/workouts?isPublic=true");

    const publicWorkouts = await res.json();

    // Reverse to get newest to front
    return publicWorkouts.reverse();
  } catch (e) {
    console.log(e);
  }
};

// Multiple
export const getWorkoutsFromIdArray = async (idArr) => {
  try {
    const res = await fetch("/api/workouts/queryMultiple", {
      method: "POST",
      body: JSON.stringify(idArr),
    });

    const workouts = await res.json();

    // Sort workouts to be in the same order that the irArr requests them
    workouts.sort((a, b) => idArr.indexOf(a._id) - idArr.indexOf(b._id));

    return workouts;
  } catch (e) {
    console.log(e);
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

export const getRoutineFromId = async (routine_id) => {
  try {
    const res = await fetch(`/api/routines/${routine_id}`);

    const routineData = await res.json();

    return routineData;
  } catch (e) {
    console.log(e);
    return false;
  }
};
export const postNewRoutine = async (newRoutine) => {
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

export const updateRoutine = async (updatedRoutine) => {
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
export const getTeamById = async (team_id) => {
  try {
    const res = await fetch(`/api/teams/${team_id}`);

    const team = await res.json();
    return team;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getUserMadeTeams = async (user_id) => {
  try {
    const res = await fetch(`/api/teams?creator_id=${user_id}`);
    const teams = await res.json();

    return teams;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const addTrainerToTeam = async (team_id, trainer_id) => {
  try {
    const res = await fetch(`/api/teams/${team_id}?addTrainer=${trainer_id}`, { method: "PUT" });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const removeTrainerFromTeam = async (team_id, trainer_id) => {
  try {
    const res = await fetch(`/api/teams/${team_id}?removeTrainer=${trainer_id}`, { method: "PUT" });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
