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
          name="username"
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

      {invalidLoginCreds && <p>Email or Password was incorrect</p>}

      <a onClick={changeFormType}>
        <p>Create an account here</p>
      </a>
    </LoginContainer>
  );
};
export default Login;

const LoginContainer = styled.div`
  text-align: center;

  form {
    margin: 1rem 0.5rem;
    input {
      width: 90%;
      margin: 0.5rem 0;
      padding: 0.5rem 0 0.5rem 0.5rem;
      font-size: 1rem;
      border: none;
      border-radius: 5px;
      background: ${({ theme }) => theme.shades[1]};
      color: ${({ theme }) => theme.shades[8]};
    }
    button {
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
