import { useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";

import { useStoreContext } from "../context/state";
import SeoHead from "./SeoHead";

export default function Layout({ title = "Workout App", children }) {
  const { loginUser } = useStoreContext();

  // Check local storage for username for persistant login
  useEffect(() => {
    const user_id = localStorage.getItem("workoutID");
    if (user_id) {
      loginUser(user_id);
    }
  }, []);

  return (
    <>
      <SeoHead title={title} />
      <main>
        <h1>Anagnostou Lift Club</h1>
        <NavBar>
          <ul>
            <Link href="/">
              <li>
                <a>Home</a>
              </li>
            </Link>
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
            <Link href="/schedule">
              <li>
                <a>Schedule</a>
              </li>
            </Link>
          </ul>
        </NavBar>
        {children}
      </main>
    </>
  );
}

const NavBar = styled.nav`
  ul {
    width: 100%;
    display: flex;
    list-style: none;
    li {
      width: 25%;
      display: grid;
      place-items: center;
      border: 1px solid grey;
      cursor: pointer;
      padding: 0.5rem 0;
      text-align: center;
    }
  }
`;
