import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Context
import { useStoreState, useStoreDispatch, loginUser } from "../store";
// Components
import Login from "../components/HomePage/Login";
import SeoHead from "../components/SeoHead";

export default function Home() {
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const { user } = useStoreState();

  // Route to workoutLog
  const routeToWorkoutLog = () => setTimeout(() => router.push("/workoutLog"), 3000);

  const persistLogin = async (user_id) => {
    const loginSuccess = await loginUser(dispatch, user_id);
    if (loginSuccess) routeToWorkoutLog();
  };

  // Check local storage for username for persistant login
  useEffect(() => {
    const user_id = localStorage.getItem("workoutID");
    // If local storage workoutID exists, login user
    if (user_id) persistLogin(user_id);
  }, []);

  return (
    <MainContainer>
      <SeoHead title="Anagnostou Lift Club" />

      {user ? (
        <WelcomeMessage>
          <h1>Welcome {user.username}</h1>
          <p>You have logged {user.workoutLog.length} workouts.</p>
        </WelcomeMessage>
      ) : (
        <>
          <Brand>
            <span>
              <img src="favicon.jpeg" alt="brand logo" />
            </span>

            <h1>ALC</h1>
            <h4>Anagnostou Lift Club</h4>
          </Brand>

          <Login routeToWorkoutLog={routeToWorkoutLog} />
        </>
      )}
    </MainContainer>
  );
}

const MainContainer = styled.div`
  font-family: Tahoma, Helvetica;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .loginContainer {
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
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 30%;
  margin-bottom: 2rem;

  span img {
    max-height: 130px;
    margin-bottom: -2rem;
  }

  h1 {
    text-align: center;
    font-weight: 100;
    font-size: 3.5rem;
    color: #5d78ee;
  }
  h4 {
    font-size: 1rem;
    text-align: center;
    font-weight: 200;
    color: grey;
  }
`;
