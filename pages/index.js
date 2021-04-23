import { useState } from "react";
import styled from "styled-components";

import Layout from "../components/Layout";
import { useStoreContext } from "../context/state";

const Home = () => {
  const { authenticateLogin, user, setUserState } = useStoreContext();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [invalidLoginCreds, setInvalidLoginCreds] = useState(false);

  const [createAccUsername, setCreateAccUsername] = useState("");
  const [createAccPassword, setCreateAccPassword] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);

  // LOGIN handlers
  const handleLoginUsernameChange = (e) => {
    setLoginUsername(e.target.value);
  };

  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = await authenticateLogin(loginUsername, loginPassword);

    userData
      ? (localStorage.setItem("workoutID", userData._id), setInvalidLoginCreds(false))
      : setInvalidLoginCreds(true);
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

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: createAccUsername, password: createAccPassword }),
      });

      // Response status if username is already taken
      if (res.status === 403) setUsernameExists(true);

      const userData = await res.json();
      localStorage.setItem("workoutID", userData._id);
      setUserState(userData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout>
      <MainContainer>
        {!user && (
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
        {user && (
          <div>
            <h1>Welcome {user.username}</h1>
          </div>
        )}
      </MainContainer>
    </Layout>
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
