export const loginUser = async (dispatch, user_id) => {
  try {
    const res = await fetch(`/api/users/${user_id}`);
    const userData = await res.json();

    dispatch({ type: "LOGIN", payload: { userData } });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const logoutUser = async (dispatch) => {
  dispatch("LOGOUT");
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

    dispatch({ type: "LOGIN", payload: { userData } });

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

    dispatch({ type: "LOGIN", payload: { userData } });

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
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveWeight = async (weight) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: "PUT",
      contentType: "application/json",
      body: JSON.stringify({ weight }),
    });

    const userData = await res.json();
    // dispatch({ type: "SET_USER", payload: { userData } });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
