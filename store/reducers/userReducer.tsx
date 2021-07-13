import { User } from "../../utils/interfaces";

interface AppState {
  user: User | undefined;
  isSignedIn: boolean;
  isUsingPWA: boolean;
  platform: string;
}

export default function userReducer(state: AppState, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload.userData, isSignedIn: true };

    case "LOGOUT":
      return { ...state, user: undefined, isSignedIn: false };

    case "USING_PWA":
      return { ...state, isUsingPWA: true };

    case "USING_iOS_PWA":
      return { ...state, platform: "ios" };

    default:
      throw new Error();
  }
}
