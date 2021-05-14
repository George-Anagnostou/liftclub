import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
// Components
import SeoHead from "./SeoHead";
import Notebook from "../public/navIcons/Notebook";
import Builder from "../public/navIcons/Builder";
import Feed from "../public/navIcons/Feed";
import Stats from "../public/navIcons/Stats";
// Context
import { useStoreDispatch, loginUser } from "../store";

const routes = [
  { pathname: "/workoutLog", icon: <Notebook /> },
  { pathname: "/workoutBuilder", icon: <Builder /> },
  { pathname: "/workoutFeed", icon: <Feed /> },
  { pathname: "/myProfile", icon: <Stats /> },
];

export default function Layout({ title = "Workout App", children }) {
  const router = useRouter();

  const dispatch = useStoreDispatch();

  const [showIcons, setShowIcons] = useState(false);

  // Check local storage for user_id for persistant login
  useEffect(() => {
    const user_id = localStorage.getItem("workoutID");

    // If local storage workoutID exists, login user
    user_id ? loginUser(dispatch, user_id) : router.push("/");
  }, []);

  return (
    <>
      <SeoHead title={title} />
      <MainContainer>
        <NavBar>
          <NavBurger
            onClick={() => setShowIcons((prev) => !prev)}
            className={showIcons ? "burgOpen" : "burgClosed"}
          >
            <div />
            <div />
            <div />
          </NavBurger>

          <NavIcons className={showIcons ? "navOpen" : "navClosed"}>
            {routes.map((route) => (
              <Link href={route.pathname} key={route.pathname}>
                <li
                  style={
                    router.pathname === route.pathname
                      ? { fill: "black", boxShadow: " 0 2px 10px #888888" }
                      : null
                  }
                >
                  <a>{route.icon}</a>
                </li>
              </Link>
            ))}
          </NavIcons>
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
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 99;

  .navOpen {
    top: 0;
  }
  .navClosed {
    top: 8vh;
    transform: scale(0);
    opacity: 0;
  }

  .burgClosed {
    div {
      width: 40%;
      height: 3px;
      border-radius: 5px;
      background: #ccc;
    }
  }
  .burgOpen {
    div {
      width: 40%;
      height: 3px;
      border-radius: 5px;
      background: grey;

      &:nth-child(1) {
        transform: rotate(45deg) translateX(6px) translateY(6px);
        width: 30%;
      }
      &:nth-child(2) {
        transform: scale(0);
      }
      &:nth-child(3) {
        transform: rotate(-45deg) translateX(8px) translateY(-8px);
        width: 30%;
      }
    }
  }
`;

const NavBurger = styled.div`
  border: 1px solid #ccc;
  background: transparent;
  height: 100px;
  width: 100px;
  box-shadow: 0 -2px 4px #ccc;
  background: white;
  border-radius: 50% 50% 0 0;
  padding-top: 10px;
  padding-bottom: 65px;
  transform: translateY(60px);
  margin: auto;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  div {
    transition: all 0.2s ease;
  }
`;

const NavIcons = styled.ul`
  position: absolute;
  height: 5rem;
  width: 100%;
  pointer-events: none;
  transition: all 0.2s ease-out;
  z-index: -1;
  opacity: 1;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
  li {
    border-radius: 50%;
    height: 65px;
    width: 65px;
    background: white;
    border: 1px solid #eee;
    box-shadow: 0 2px 6px #ccc;
    fill: grey;

    pointer-events: visible;

    display: flex;
    align-items: center;
    justify-content: center;

    &:nth-of-type(1) {
      margin-top: 3rem;
    }
    &:nth-of-type(2) {
      margin-top: -3rem;
    }
    &:nth-of-type(3) {
      margin-top: -3rem;
    }
    &:nth-of-type(4) {
      margin-top: 3rem;
    }
  }
`;
