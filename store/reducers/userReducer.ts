import { User } from "../../utils/interfaces";

interface AppState {
  user: User | undefined;
  isSignedIn: boolean;
  isUsingPWA: boolean;
  platform: string;
}

export default function userReducer(state: AppState, action) {
  const { type, payload } = action;

  switch (type) {
    case "SET_USER":
      return { ...state, user: payload.userData, isSignedIn: true };

    case "LOGOUT":
      return { ...state, user: undefined, isSignedIn: false };

    case "USING_PWA":
      return { ...state, isUsingPWA: true };

    case "USING_iOS_PWA":
      return { ...state, platform: "ios" };

    case "ADD_DAY_TO_WORKOUT_LOG":
      return {
        ...state,
        user: {
          ...state.user,
          workoutLog: { ...state.user?.workoutLog, [payload.key]: payload.value },
        },
      };

    case "DELETE_DAY_FROM_WORKOUT_LOG":
      delete state.user?.workoutLog[payload.key];
      return { ...state };

    default:
      throw new Error();
  }
}
