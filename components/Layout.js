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
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/workoutLog">
                <a>Workout Log</a>
              </Link>
            </li>
            <li>
              <Link href="/workoutBuilder">
                <a>Workout Buider</a>
              </Link>
            </li>
            <li>
              <Link href="/schedule">
                <a>Schedule</a>
              </Link>
            </li>
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
      margin-right: 1rem;
    }
  }
`;
