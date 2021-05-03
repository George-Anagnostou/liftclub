const initlialState = {};

export default function userReducer(state = initlialState, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload.userData };
    case "LOGIN":
      return { ...state, user: action.payload.userData };
    case "LOGOUT":
      return { ...state, user: undefined };

    default:
      throw new Error();
  }
}
