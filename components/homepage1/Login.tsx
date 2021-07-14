import { useState } from "react";
import styled from "styled-components";

import { useStoreDispatch, authLogin } from "../../store";

interface Props {
  routeToWorkoutLog: () => Promise<boolean>;
  handleLinkClick: () => void;
}

const Login: React.FC<Props> = ({ routeToWorkoutLog, handleLinkClick }) => {
  const dispatch = useStoreDispatch();

  const [loginCreds, setLoginCreds] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
  const [invalidLoginCreds, setInvalidLoginCreds] = useState(false);

  const handleLoginUsernameChange = (e) =>
    setLoginCreds((prev) => ({ ...prev, username: e.target.value }));

  const handleLoginPasswordChange = (e) =>
    setLoginCreds((prev) => ({ ...prev, password: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = await authLogin(dispatch, loginCreds.username, loginCreds.password);

    if (userData) {
      localStorage.setItem("workoutID", userData._id);
      routeToWorkoutLog();
    } else {
      setInvalidLoginCreds(true);
    }
  };

  return (
    <LoginContainer>
      <form action="POST" onSubmit={handleLogin}>
        <h3>Welcome</h3>

        {invalidLoginCreds && <p>Email or Password was incorrect</p>}

        <input
          type="text"
          name="username"
          id="username"
          value={loginCreds.username}
          onChange={handleLoginUsernameChange}
          placeholder="Username"
          required
        />

        <input
          type="password"
          name="password"
          id="password"
          value={loginCreds.password}
          onChange={handleLoginPasswordChange}
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>
      </form>

      <a onClick={handleLinkClick}>
        <p>Create an account here</p>
      </a>
    </LoginContainer>
  );
};
export default Login;

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
