/*
 *
 *
 *
 * USERS
 *
 *
 *
 */

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
