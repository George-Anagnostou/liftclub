import { useState } from "react";
import styled from "styled-components";

import { useStoreDispatch, createAccount } from "../../store";

export default function createAcc({ routeToWorkoutLog, handleLinkClick }) {
  const dispatch = useStoreDispatch();

  const [accCreds, setAccCreds] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
  const [usernameExists, setUsernameExists] = useState(false);

  // CREATE ACCOUNT handlers
  // Username cannot contain special characters
  const handleAccCredsUsername = (e) =>
    setAccCreds((prev) => ({
      ...prev,
      username: e.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""),
    }));

  const handleAccCredsPassword = (e) =>
    setAccCreds((prev) => ({ ...prev, password: e.target.value }));

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    const userData = await createAccount(dispatch, accCreds.username, accCreds.password);

    if (userData) {
      setUsernameExists(false);
      localStorage.setItem("workoutID", userData._id);
      routeToWorkoutLog();
    } else {
      setUsernameExists(true);
    }
  };

  return (
    <CreateContainer>
      <form action="POST" onSubmit={handleCreateAccount}>
        <h3>Create Account</h3>

        <div>
          <input
            type="text"
            name="username"
            id="username"
            value={accCreds.username}
            onChange={handleAccCredsUsername}
            placeholder="Username"
            required
          />

          <input
            type="text"
            name="password"
            id="password"
            value={accCreds.password}
            onChange={handleAccCredsPassword}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Join</button>
      </form>


      <a onClick={handleLinkClick}>
        <p>Have an account? Login here</p>
      </a>
      
      {usernameExists && <p>Username is already taken</p>}
    </CreateContainer>
  );
}

const CreateContainer = styled.div`
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

      &:active {
        background: #94a4ee;
      }
    }
  }

  a {
    font-style: italic;
    color: grey;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
