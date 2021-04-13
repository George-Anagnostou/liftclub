import { useState } from "react";
import Layout from "../components/Layout";
import { useStoreContext } from "../context/state";

const Home = () => {
  const { authUser, user } = useStoreContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidCreds, setInvalidCreds] = useState(true);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = await authUser(username, password);
    
    userData
      ? (localStorage.setItem("workoutID", userData._id), setInvalidCreds(true))
      : setInvalidCreds(false);
  };

  return (
    <Layout>
      <div>
        {!user && (
          <form action="post" onSubmit={handleLogin}>
            <label htmlFor="username">Login username: </label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
            <label htmlFor="password">Login password: </label>
            <input
              type="text"
              name="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button type="submit" onClick={handleLogin}>
              Login
            </button>
          </form>
        )}
        {!invalidCreds && <p>Email or Password was incorrect</p>}
        {user && <h1>Hello {user.username}</h1>}
      </div>
    </Layout>
  );
};

export default Home;
