import React, { useState } from "react";
import styled from "styled-components";
// Context
import { useUserDispatch, createAccount } from "../../store";

interface Props {
  changeFormType: () => void;
  handleAuthSuccess: () => void;
}

const CreateAcc: React.FC<Props> = ({ changeFormType, handleAuthSuccess }) => {
  const dispatch = useUserDispatch();

  const [usernameExists, setUsernameExists] = useState(false);
  const [accCreds, setAccCreds] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = await createAccount(dispatch, accCreds.username, accCreds.password);
    userData ? handleAuthSuccess() : setUsernameExists(true);
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
        <div>
          <input
            type="text"
            name="liftclub-username"
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
        <button type="submit">Create Account</button>
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
  width: 90%;

  form {
    margin: 1rem 0.5rem;

    input {
      width: 90%;
      min-width: 90%;
      margin: 0.5rem 0;
      padding: 0.5rem 0 0.5rem 0.5rem;
      font-size: 1rem;
      border: none;
      background: inherit;
      border-radius: 0;
      border: 1px solid transparent;
      border-bottom: 1px solid ${({ theme }) => theme.text};
      color: inherit;

      &:focus {
        border: 1px solid ${({ theme }) => theme.text};
        outline: none;
        border-radius: 5px;
      }
    }
    button {
      margin-top: 1rem;
      padding: 0.5rem;
      width: 90%;
      color: ${({ theme }) => theme.accentSoft};
      border: 1px solid ${({ theme }) => theme.accentSoft};
      background: inherit;
      font-size: 1rem;
      border-radius: 5px;

      &:active {
        background: ${({ theme }) => theme.background};
      }
    }
  }

  a {
    font-style: italic;
    color: ${({ theme }) => theme.textLight};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
