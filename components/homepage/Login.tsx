import React, { useState } from "react";
import styled from "styled-components";
// Context
import { useUserDispatch, authLogin } from "../../store";

interface Props {
  changeFormType: () => void;
  handleAuthSuccess: () => void;
}

const Login: React.FC<Props> = ({ changeFormType, handleAuthSuccess }) => {
  const dispatch = useUserDispatch();

  const [invalidLoginCreds, setInvalidLoginCreds] = useState(false);
  const [loginCreds, setLoginCreds] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = await authLogin(dispatch, loginCreds.username, loginCreds.password);
    userData ? handleAuthSuccess() : setInvalidLoginCreds(true);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginCreds((prev) => ({ ...prev, username: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginCreds((prev) => ({ ...prev, password: e.target.value }));
  };

  return (
    <LoginContainer>
      <form action="POST" onSubmit={handleLogin}>
        <input
          type="text"
          name="liftclub-username"
          id="username"
          value={loginCreds.username}
          onChange={handleUsernameChange}
          placeholder="Username"
          required
        />

        <input
          type="password"
          name="password"
          id="password"
          value={loginCreds.password}
          onChange={handlePasswordChange}
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>
      </form>

      {invalidLoginCreds && <p>Username or password was incorrect</p>}

      <a onClick={changeFormType}>
        <p>Create an account here</p>
      </a>
    </LoginContainer>
  );
};
export default Login;

export const LoginContainer = styled.div`
  text-align: center;
  width: 90%;

  form {
    margin: 2rem 0.5rem;
    input {
      width: 90%;
      margin: 0.5rem 0;
      padding: 0.5rem 0 0.25rem 0.5rem;
      font-size: 1rem;
      border: none;
      background: inherit;
      border-radius: 0;
      border: 1px solid transparent;
      border-bottom: 1px solid ${({ theme }) => theme.accentSoft};
      color: inherit;

      &:focus {
        border: 1px solid ${({ theme }) => theme.accentSoft};
        outline: none;
        border-radius: 5px;
      }
    }
    button {
      margin-top: 1rem;
      padding: 0.35rem;
      width: 90%;
      font-weight: 300;
      letter-spacing: 1px;
      color: ${({ theme }) => theme.text};
      border: 1px solid ${({ theme }) => theme.accentSoft};
      background: inherit;
      background: ${({ theme }) => theme.buttonMedGradient};
      box-shadow: inset 0 0px 4px ${({ theme }) => theme.accent},
        0 3px 5px ${({ theme }) => theme.boxShadow};
      font-size: 1rem;
      border-radius: 5px;
      transition: all 0.3s ease;

      &:active {
        background: ${({ theme }) => theme.background};
        outline: none;
        transform: scale(0.98);
      }
    }
  }

  a {
    display: block;
    font-size: 0.8rem;
    margin-top: 2rem;
    font-style: italic;
    color: ${({ theme }) => theme.textLight};
    text-decoration: none;

    &:active,
    &:hover {
      text-decoration: underline;
    }
  }
`;
