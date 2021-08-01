import React, { useState } from "react";
import styled from "styled-components";
// Context
import { useStoreDispatch, createAccount } from "../../store";
// Interfaces
import { User } from "../../utils/interfaces";

interface Props {
  changeFormType: () => void;
  handleAuthSuccess: (user: User) => void;
}

const CreateAcc: React.FC<Props> = ({ changeFormType, handleAuthSuccess }) => {
  const dispatch = useStoreDispatch();

  const [usernameExists, setUsernameExists] = useState(false);
  const [accCreds, setAccCreds] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = await createAccount(dispatch, accCreds.username, accCreds.password);
    userData ? handleAuthSuccess(userData) : setUsernameExists(true);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Username cannot contain special characters
    setAccCreds((prev) => ({
      ...prev,
      username: e.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""),
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccCreds((prev) => ({ ...prev, password: e.target.value }));
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
            onChange={handleUsernameChange}
            placeholder="Username"
            required
          />

          <input
            type="text"
            name="password"
            id="password"
            value={accCreds.password}
            onChange={handlePasswordChange}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Join</button>
      </form>

      <a onClick={changeFormType}>
        <p>Have an account? Login here</p>
      </a>

      {usernameExists && <p>Username is already taken</p>}
    </CreateContainer>
  );
};
export default CreateAcc;

const CreateContainer = styled.div`
  text-align: center;

  h3 {
    font-weight: 300;
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
