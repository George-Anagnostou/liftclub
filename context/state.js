import { createContext, useContext, useState } from "react";

export const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);

  const setUserState = (userData) => {
    setUser(userData);
  };

  const authenticateLogin = async (username, password) => {
    // combine username & password into an object
    const loginCreds = { username, password };
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify(loginCreds),
        headers: { "Content-Type": "application/json" },
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
    <StoreContext.Provider value={{ user, loginUser, logoutUser, authenticateLogin, setUserState }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  return useContext(StoreContext);
}
