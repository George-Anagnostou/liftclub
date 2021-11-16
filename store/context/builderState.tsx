import { createContext, useContext, useReducer } from "react";
import builderReducer from "../reducers/builderReducer";
import { Workout, Routine, Team } from "../../types/interfaces";

interface StoreContextState {
  workouts: { saved: Workout[] | undefined; created: Workout[] | undefined };
  routines: { created: Routine[] | undefined };
  teams: { created: Team[] | undefined };
}

const InitialStoreState = {
  workouts: { saved: undefined, created: undefined },
  routines: { created: undefined },
  teams: { created: undefined },
};

const StoreStateContext = createContext<StoreContextState>(InitialStoreState);
const StoreDispatchContext = createContext<any>(null);

export function useBuilderState() {
  const context = useContext(StoreStateContext);
  if (context === undefined) throw new Error("useAuthState must be used within a AuthProvider");

  return context;
}

export function useBuilderDispatch() {
  const context = useContext(StoreDispatchContext);
  if (context === undefined) throw new Error("useAuthDispatch must be used within a AuthProvider");

  return context;
}

export const BuilderStoreProvider = ({ children }) => {
  const [builder, dispatch] = useReducer(builderReducer, InitialStoreState);

  return (
    <StoreStateContext.Provider value={builder}>
      <StoreDispatchContext.Provider value={dispatch}>{children}</StoreDispatchContext.Provider>
    </StoreStateContext.Provider>
  );
};
