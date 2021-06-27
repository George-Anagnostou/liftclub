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
  const [user, dispatch] = useReducer(userReducer, { user: undefined, isUsingPWA: false });

  return (
    <StoreStateContext.Provider value={user}>
      <StoreDispatchContext.Provider value={dispatch}>{children}</StoreDispatchContext.Provider>
    </StoreStateContext.Provider>
  );
};
