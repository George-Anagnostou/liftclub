import React, { useState } from "react";
import styled from "styled-components";
// Context
import { useUserDispatch, createAccount } from "../../store";
import { LoginContainer } from "./Login";

interface Props {
  changeFormType: () => void;
  handleAuthSuccess: () => void;
}

const CreateAcc: React.FC<Props> = ({ changeFormType, handleAuthSuccess }) => {
  const dispatch = useUserDispatch();

  const [usernameExists, setUsernameExists] = useState(false);
  const [accCreds, setAccCreds] = useState<{ username: string; password: string; email: string }>({
    username: "",
    password: "",
    email: "",
  });

  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = await createAccount(
      dispatch,
      accCreds.username,
      accCreds.password,
      accCreds.email
    );
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

  const handleEmailChange = (e) => {
    setAccCreds((prev) => ({ ...prev, email: e.target.value }));
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

          <input
            type="email"
            name="email"
            id="email"
            value={accCreds.email}
            onChange={handleEmailChange}
            placeholder="Email"
            required
          />
        </div>

        <button type="submit">Create Account</button>
      </form>

      {usernameExists && <p>Username is already registered.</p>}

      <a onClick={changeFormType}>
        <p>Have an account? Login here</p>
      </a>
    </CreateContainer>
  );
};
export default CreateAcc;

const CreateContainer = styled(LoginContainer)``;
