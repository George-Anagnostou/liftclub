import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import { useStoreDispatch, authLogin } from "../../store";

export default function Login({ routeToWorkoutLog }) {
  const dispatch = useStoreDispatch();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [invalidLoginCreds, setInvalidLoginCreds] = useState(false);

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

  return (
    <div className="loginContainer">
      <form action="POST" onSubmit={handleLogin}>
        <h3>Welcome</h3>
        {invalidLoginCreds && <p>Email or Password was incorrect</p>}
        <input
          type="text"
          name="username"
          id="username"
          value={loginUsername}
          onChange={handleLoginUsernameChange}
          placeholder="Username"
          required
        />

        <input
          type="password"
          name="password"
          id="password"
          value={loginPassword}
          onChange={handleLoginPasswordChange}
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>
      </form>

      <Link href={"/createAcc"}>
        <p>Create an account here</p>
      </Link>
    </div>
  );
}

const LoginContainer = styled.div`
  text-align: center;

  h3 {
    font-weight: 100;
    color: grey;
  }

  form {
    margin: 1rem 0.5rem;
    input {
      width: 100%;
      margin: 0.5rem 0;
      padding: 0.5rem 0 0.5rem 0.5rem;
      font-size: 1.2rem;
      border: none;
      border-radius: 5px;
      background: #e7e7e7;
    }
    button {
      padding: 0.5rem;
      width: 100%;
      color: #5d78ee;
      border: 1px solid #5d78ee;
      background: inherit;
      font-size: 1.2rem;
      border-radius: 5px;
    }
  }

  a {
    font-style: italic;
    color: grey;
  }
`;
