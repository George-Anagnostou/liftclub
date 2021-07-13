import { createContext, useContext, useReducer } from "react";
import userReducer from "../reducers/userReducer";
import { User } from "../../utils/interfaces";

interface StoreContextState {
  user: User | undefined;
  isSignedIn: boolean;
  isUsingPWA: boolean;
  platform: string;
}

const InitialStoreState = {
  user: undefined,
  isSignedIn: false,
  isUsingPWA: false,
  platform: "web",
};

const StoreStateContext = createContext<StoreContextState>(InitialStoreState);
const StoreDispatchContext = createContext<any>(null);

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
  const [user, dispatch] = useReducer(userReducer, InitialStoreState);

  return (
    <StoreStateContext.Provider value={user}>
      <StoreDispatchContext.Provider value={dispatch}>{children}</StoreDispatchContext.Provider>
    </StoreStateContext.Provider>
  );
};
