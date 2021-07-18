import {
  loginWithID,
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
  loginWithID,
  logoutUser,
  authLogin,
  createAccount,
  setIsUsingPWA,
  setPlatformToiOS,
};
