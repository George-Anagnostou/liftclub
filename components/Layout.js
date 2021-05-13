import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

import SeoHead from "./SeoHead";

import { useStoreDispatch, loginUser } from "../store";

const routes = [
  { pathname: "/workoutLog", linkTitle: "Log" },
  { pathname: "/workoutBuilder", linkTitle: "Builder" },
  { pathname: "/workoutFeed", linkTitle: "Feed" },
  { pathname: "/myProfile", linkTitle: "Profile" },
];

export default function Layout({ title = "Workout App", children }) {
  const { pathname } = useRouter();

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
        <NavBar>
          <ul>
            {routes.map((route) => (
              <Link href={route.pathname} key={route.pathname}>
                <li style={pathname === route.pathname ? { background: "#EAEEFF" } : null}>
                  <a>{route.linkTitle}</a>
                </li>
              </Link>
            ))}
          </ul>
        </NavBar>
        {children}
      </MainContainer>
    </>
  );
}

const MainContainer = styled.main`
  text-align: center;
  margin-bottom: 10vh;
`;

const NavBar = styled.nav`
  background: white;

  position: fixed;
  bottom: 0;
  width: 100%;

  z-index: 99;

  ul {
    box-shadow: 0 -3px 10px #ccc;
    height: 8vh;
    width: 100%;

    display: flex;
    justify-content: space-evenly;
    align-items: center;
    li {
      flex: 1;
      border: 1px solid #ccc;
      margin: 0 0.5rem;
      border-radius: 5px;
      height: 80%;

      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
