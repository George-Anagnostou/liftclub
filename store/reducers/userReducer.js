export default function userReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload.userData };

    case "LOGOUT":
      return { ...state, user: undefined };

    default:
      throw new Error();
  }
}
