import {
  loginUser,
  logoutUser,
  authLogin,
  createAccount,
  setIsUsingPWA,
  setPlatformToiOS,
} from "./actions/userActions";
import { StoreProvider, useStoreDispatch, useStoreState } from "./context/state";

export {
  StoreProvider,
  useStoreDispatch,
  useStoreState,
  loginUser,
  logoutUser,
  authLogin,
  createAccount,
  setIsUsingPWA,
  setPlatformToiOS,
};
