import { useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";

import SeoHead from "./SeoHead";

import { useStoreDispatch, loginUser } from "../store";

export default function Layout({ title = "Workout App", children }) {
  const dispatch = useStoreDispatch();

  // Check local storage for user_id for persistant login
  useEffect(() => {
    const user_id = localStorage.getItem("workoutID");

    // If local storage workoutID exists, login user
    if (user_id) loginUser(dispatch, user_id);
  }, []);

  return (
    <>
      <SeoHead title={title} />
      <MainContainer>
        <h1>Anagnostou Lift Club</h1>
        <NavBar>
          <ul>
            <Link href="/workoutLog">
              <li>
                <a>Workout Log</a>
              </li>
            </Link>
            <Link href="/workoutBuilder">
              <li>
                <a>Workout Buider</a>
              </li>
            </Link>
          </ul>
        </NavBar>
        {children}
      </MainContainer>
    </>
  );
}

const MainContainer = styled.main`
  text-align: center;
`;

const NavBar = styled.nav`
  ul {
    border-bottom: 4px solid #cacaca;
    width: 100%;
    display: flex;
    list-style: none;
    li {
      border: none;
      border-radius: 5px 5px 0 0;
      box-shadow: 0 0 2px grey;

      flex: 1;
      display: grid;
      place-items: center;
      cursor: pointer;
      padding: 0.5rem 0.1rem;
      text-align: center;
    }
  }
`;
