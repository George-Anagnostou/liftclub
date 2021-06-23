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

export const joinTeam = async (user_id, team_id) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      contentType: "application/json",
      body: JSON.stringify({ joinTeam: team_id }),
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const leaveTeam = async (user_id, team_id) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      contentType: "application/json",
      body: JSON.stringify({ leaveTeam: team_id }),
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveSavedWorkouts = async (savedWorkouts, user_id) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      contentType: "application/json",
      body: JSON.stringify({ savedWorkouts }),
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveWorkoutLog = async (workoutLog, user_id) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      contentType: "application/json",
      body: JSON.stringify({ workoutLog }),
    });

    const userData = await res.json();
    return userData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveWeight = async (weight, user_id) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      contentType: "application/json",
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
      contentType: "application/json",
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
      contentType: "application/json",
      body: JSON.stringify({ unfollow: followee_id }),
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveBio = async (user_id, bio) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      contentType: "application/json",
      body: JSON.stringify({ bio }),
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const fetchUserSavedWorkouts = async (user_id) => {
  try {
    const res = await fetch(`/api/users/${user_id}?field=savedWorkouts`);
    const workouts = await res.json();

    return workouts;
  } catch (e) {
    console.log(e);
  }
};

export const fetchDateFromUserWorkoutLog = async (user_id, isoDate) => {
  try {
    const res = await fetch(`/api/users/${user_id}?field=workoutLog&date=${isoDate}`);
    const logData = await res.json();

    return logData;
  } catch (e) {
    console.log(e);
  }
};

export const deleteWorkoutFromWorkoutLog = async (user_id, isoDate) => {
  try {
    const res = await fetch(`/api/users/${user_id}?field=workoutLog&date=${isoDate}`, {
      method: "DELETE",
    });
    const updatedLog = await res.json();
    return updatedLog;
  } catch (e) {
    console.log(e);
  }
};

// Multiple
export const getUsersFromIdArr = async (idArr) => {
  try {
    const res = await fetch(`api/users/queryMultiple`, {
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(idArr),
    });

    const users = await res.json();
    return users;
  } catch (e) {
    console.log(e);
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
export const getExercisesFromIdArray = async (idArr) => {
  try {
    const res = await fetch("/api/exercises/queryMultiple", {
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(idArr),
    });

    const exercises = await res.json();
    return exercises;
  } catch (e) {
    console.log(e);
  }
};

export const createExercise = async (exercise) => {
  try {
    const res = await fetch("/api/exercises", {
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(exercise),
    });

    return { status: res.status };
  } catch (e) {
    console.log(e);
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
      contentType: "application/json",
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
      contentType: "application/json",
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
      contentType: "application/json",
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
    return userMadeWorkouts;
  } catch (e) {
    console.log(e);
  }
};

export const getPublicWorkouts = async () => {
  try {
    const res = await fetch("/api/workouts?isPublic=true");

    const publicWorkouts = await res.json();
    return publicWorkouts;
  } catch (e) {
    console.log(e);
  }
};

// Multiple
export const getWorkoutsFromIdArray = async (idArr) => {
  try {
    const res = await fetch("/api/workouts/queryMultiple", {
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(idArr),
    });

    const workouts = await res.json();
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
