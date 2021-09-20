import { User } from "../../utils/interfaces";

type AppState = {
  user: User | undefined;
  isSignedIn: boolean;
  isUsingPWA: boolean;
  platform: string;
};

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

    case "ADD_ID_TO_FOLLOWING":
      return {
        ...state,
        user: { ...state.user, following: [...(state.user?.following || []), payload.id] },
      };

    case "REMOVE_ID_FROM_FOLLOWING":
      return {
        ...state,
        user: {
          ...state.user,
          following: state.user?.following?.filter((_id) => _id !== payload.id) || [],
        },
      };

    case "ADD_ID_TO_TEAMS_JOINED":
      return {
        ...state,
        user: { ...state.user, teamsJoined: [...(state.user?.teamsJoined || []), payload.id] },
      };

    case "REMOVE_ID_FROM_TEAMS_JOINED":
      return {
        ...state,
        user: {
          ...state.user,
          teamsJoined: state.user?.teamsJoined?.filter((_id) => _id !== payload.id) || [],
        },
      };

    case "ADD_ID_TO_SAVED_WORKOUTS":
      return {
        ...state,
        user: { ...state.user, savedWorkouts: [...(state.user?.savedWorkouts || []), payload.id] },
      };
    case "REMOVE_ID_FROM_SAVED_WORKOUTS":
      return {
        ...state,
        user: {
          ...state.user,
          savedWorkouts: state.user?.savedWorkouts?.filter((_id) => _id !== payload.id) || [],
        },
      };
    case "ADD_ID_TO_RECENTLY_VIEWED_USERS":
      return {
        ...state,
        user: {
          ...state.user,
          recentlyViewedUsers: [payload.id, ...(state.user?.recentlyViewedUsers || [])],
        },
      };
    default:
      throw new Error();
  }
}
