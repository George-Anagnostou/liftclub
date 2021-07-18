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

export const logoutUser = async (dispatch) => {
  dispatch({ type: "LOGOUT" });
  localStorage.removeItem("workoutID");
};

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

export const setIsUsingPWA = (dispatch: any) => {
  dispatch({ type: "USING_PWA" });
};

export const setPlatformToiOS = (dispatch: any) => {
  dispatch({ type: "USING_iOS_PWA" });
};
