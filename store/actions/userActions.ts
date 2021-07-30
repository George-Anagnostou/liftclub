import { WorkoutLogItem } from "../../utils/interfaces";

/**
 *
 * @param dispatch Dispatch function from useStoreDispatch()
 * @param user_id User id as type string
 * @returns Boolean for the outcome of login request
 */
export const loginWithID = async (dispatch: any, user_id: string) => {
  try {
    const res = await fetch(`/api/users/loginWithID`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });
    const userData = await res.json();

    dispatch({ type: "SET_USER", payload: { userData } });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/**
 *
 * @param dispatch Dispatch function from useStoreDispatch()
 */
export const logoutUser = async (dispatch) => {
  dispatch({ type: "LOGOUT" });
  localStorage.removeItem("workoutID");
};

/**
 *
 * @param dispatch Dispatch function from useStoreDispatch()
 * @param username Username from login form
 * @param password Password from login form
 * @returns If successful login, returns user data, else returns false
 */
export const authLogin = async (dispatch: any, username: string, password: string) => {
  // combine username & password into an object
  const loginCreds = { username, password };
  try {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginCreds),
    });
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
 * @param dispatch Dispatch function from useStoreDispatch()
 * @param username Username from create account form
 * @param password Password from create account from
 * @returns If successful account creation, returns user data, else returns false
 */
export const createAccount = async (dispatch: any, username: string, password: string) => {
  try {
    const res = await fetch("/api/users/createUser", {
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
 * @param dispatch Dispatch function from useStoreDispatch()
 */
export const setIsUsingPWA = (dispatch: any) => {
  dispatch({ type: "USING_PWA" });
};

/**
 *
 * @param dispatch Dispatch function from useStoreDispatch()
 */
export const setPlatformToiOS = (dispatch: any) => {
  dispatch({ type: "USING_iOS_PWA" });
};

/**
 *
 * @param dispatch Dispatch function from useStoreDispatch()
 * @param user_id User id string
 * @param logValue An object with
 * @param logKey
 * @returns
 */
export const addDayToWorkoutLog = async (
  dispatch: any,
  user_id: string,
  logValue: WorkoutLogItem,
  logKey: string
) => {
  try {
    const res = await fetch(
      `/api/users/${user_id}?workoutLogKey=${logKey}&fieldToUpdate=ADD_WORKOUT_TO_WORKOUT_LOG`,
      {
        method: "PUT",
        body: JSON.stringify(logValue),
      }
    );

    dispatch({ type: "ADD_DAY_TO_WORKOUT_LOG", payload: { key: logKey, value: logValue } });

    return res.status === 201;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const deleteDayFromWorkoutLog = async (dispatch: any, user_id: string, logKey: string) => {
  try {
    const res = await fetch(
      `/api/users/${user_id}?workoutLogKey=${logKey}&fieldToUpdate=DELETE_WORKOUT_FROM_WORKOUT_LOG`,
      { method: "DELETE" }
    );

    dispatch({ type: "DELETE_DAY_FROM_WORKOUT_LOG", payload: { key: logKey } });

    return res.status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};
