import { createContext, useContext, useReducer } from "react";
import userReducer from "../reducers/userReducer";

const StoreStateContext = createContext();
const StoreDispatchContext = createContext();

export function useStoreState() {
  const context = useContext(StoreStateContext);
  if (context === undefined) throw new Error("useAuthState must be used within a AuthProvider");

  return context;
}

export function useStoreDispatch() {
  const context = useContext(StoreDispatchContext);
  if (context === undefined) throw new Error("useAuthDispatch must be used within a AuthProvider");

  return context;
}

export const StoreProvider = ({ children }) => {
  const theme = typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark";

  const [{ user, themeMode }, dispatch] = useReducer(userReducer, {
    themeMode: theme,
    user: undefined,
  });

  return (
    <StoreStateContext.Provider value={{ user, themeMode }}>
      <StoreDispatchContext.Provider value={dispatch}>{children}</StoreDispatchContext.Provider>
    </StoreStateContext.Provider>
  );
};
