export const loginUser = async (dispatch, user_id) => {
  try {
    const res = await fetch(`/api/users/${user_id}`);
    const userData = await res.json();

    dispatch({ type: "SET_USER", payload: { userData } });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const logoutUser = async (dispatch) => {
  dispatch({ type: "LOGOUT" });
  localStorage.removeItem("workoutID");
};

export const authLogin = async (dispatch, username, password) => {
  // combine username & password into an object
  const loginCreds = { username, password };
  try {
    const res = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify(loginCreds),
      headers: { "Content-Type": "application/json" },
    });
    const userData = await res.json();

    dispatch({ type: "SET_USER", payload: { userData } });

    return userData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const createAccount = async (dispatch, username, password) => {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // Response status if username is already taken
    if (res.status === 403) return false;

    const userData = await res.json();

    dispatch({ type: "SET_USER", payload: { userData } });

    return userData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/**
 *
 * @param {array} workoutLog
 * @param {ObjectId} user_id
 * @returns updated user document
 */
export const saveWorkoutLog = async (dispatch, workoutLog, user_id) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      contentType: "application/json",
      body: JSON.stringify({ workoutLog }),
    });

    const userData = await res.json();
    // dispatch({ type: "SET_USER", payload: { userData } });
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
