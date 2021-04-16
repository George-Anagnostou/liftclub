/*
 *
 *
 *
 * USERS
 *
 *
 *
 */
export const saveWorkoutLog = async (workoutLog, user_id) => {
  console.log(workoutLog);
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      contentType: "application/json",
      body: JSON.stringify(workoutLog),
    });

    const userData = await res.json();
    return userData;
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
    const res = await fetch("/api/exercises", {
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
  const res = await fetch(`/api/workouts`, {
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(workout),
  });

  return { status: res.status };
};

export const updateExistingWorkout = async (workout) => {
  const res = await fetch(`/api/workouts/${workout._id}`, {
    method: "PUT",
    contentType: "application/json",
    body: JSON.stringify(workout),
  });

  return { status: res.status };
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
