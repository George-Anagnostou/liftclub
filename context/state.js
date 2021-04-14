import { createContext, useContext, useState } from "react";

export const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);

  const setUserState = (userData) => {
    setUser(userData);
  };

  const authUser = async (username, password) => {
    const loginCreds = { username, password };
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify(loginCreds),
      });
      const userData = await res.json();
      setUser(userData);
      return userData;
    } catch (e) {
      console.log(e);
      setUser(null);
      return false;
    }
  };

  const loginUser = async (user_id) => {
    try {
      const res = await fetch(`/api/users/${user_id}`);
      const userData = await res.json();

      setUser(userData);
      return userData;
    } catch (e) {
      console.log(e);
      setUser(null);
      return false;
    }
  };

  const logoutUser = async () => {
    setUser(null);
    localStorage.removeItem("workoutID");
  };

  return (
    <StoreContext.Provider value={{ user, loginUser, logoutUser, authUser, setUserState }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  return useContext(StoreContext);
}
