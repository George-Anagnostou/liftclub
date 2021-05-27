import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useStoreState, useStoreDispatch, loginUser, authLogin, createAccount } from "../store";

const Home = () => {
  const router = useRouter();

  const dispatch = useStoreDispatch();
  const { user } = useStoreState();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [invalidLoginCreds, setInvalidLoginCreds] = useState(false);

  const [createAccUsername, setCreateAccUsername] = useState("");
  const [createAccPassword, setCreateAccPassword] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);

  // Route to workoutLog
  const routeToWorkoutLog = () => {
    setTimeout(() => {
      router.push("/workoutLog");
    }, 3000);
  };

  // Login handlers
  const handleLoginUsernameChange = (e) => {
    setLoginUsername(e.target.value);
  };

  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = await authLogin(dispatch, loginUsername, loginPassword);

    if (userData) {
      localStorage.setItem("workoutID", userData._id);
      setInvalidLoginCreds(false);
      routeToWorkoutLog();
    } else {
      setInvalidLoginCreds(true);
    }
  };

  // CREATE ACCOUNT handlers
  const handleCreateAccUsernameChange = (e) => {
    setCreateAccUsername(e.target.value);
  };
  const handleCreateAccPasswordChange = (e) => {
    setCreateAccPassword(e.target.value);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    const userData = await createAccount(dispatch, createAccUsername, createAccPassword);

    if (userData) {
      setUsernameExists(false);
      localStorage.setItem("workoutID", userData._id);
      routeToWorkoutLog();
    } else {
      setUsernameExists(true);
    }
  };

  const persistLogin = async (user_id) => {
    const loginSuccess = await loginUser(dispatch, user_id);
    if (loginSuccess) routeToWorkoutLog();
  };

  // Check local storage for username for persistant login
  useEffect(() => {
    const user_id = localStorage.getItem("workoutID");
    // If local storage workoutID exists, login user
    if (user_id) {
      persistLogin(user_id);
    }
  }, []);

  return (
    <MainContainer>
      {user ? (
        <WelcomeMessage>
          <h1>Welcome {user.username}</h1>
          <p>You have logged {user.workoutLog.length} workouts.</p>
        </WelcomeMessage>
      ) : (
        <>
          <form action="post" onSubmit={handleLogin}>
            <h3>Login</h3>
            {invalidLoginCreds && <p>Email or Password was incorrect</p>}
            <div>
              <label htmlFor="loginUsername">Username: </label>
              <input
                type="text"
                name="loginUsername"
                id="loginUsername"
                value={loginUsername}
                onChange={handleLoginUsernameChange}
              />
            </div>
            <div>
              <label htmlFor="loginPassword">Password: </label>
              <input
                type="text"
                name="loginPassword"
                id="loginPassword"
                value={loginPassword}
                onChange={handleLoginPasswordChange}
              />
            </div>
            <button type="submit" onClick={handleLogin}>
              Login
            </button>
          </form>

          <form action="post" onSubmit={handleLogin}>
            <h3>Create Account</h3>
            {usernameExists && <p>Username is already taken</p>}

            <div>
              <label htmlFor="createAccUsername">Username: </label>
              <input
                type="text"
                name="createAccUsername"
                id="createAccUsername"
                value={createAccUsername}
                onChange={handleCreateAccUsernameChange}
              />
            </div>
            <div>
              <label htmlFor="createAccPassword">Password: </label>
              <input
                type="text"
                name="createAccPassword"
                id="createAccPassword"
                value={createAccPassword}
                onChange={handleCreateAccPasswordChange}
              />
            </div>
            <button type="submit" onClick={handleCreateAccount}>
              Submit
            </button>
          </form>
        </>
      )}
    </MainContainer>
  );
};

export default Home;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;

  form {
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 5px grey;
    padding: 1rem;
    margin: 1rem 0.5rem;
    text-align: center;
    input {
      margin: 0.5rem 0;
    }
    button {
      padding: 0.5rem;
    }
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
`;
