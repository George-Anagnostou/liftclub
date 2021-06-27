import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// Components
import Notebook from "../public/navIcons/Notebook";
import Builder from "../public/navIcons/Builder";
import Feed from "../public/navIcons/Feed";
import Stats from "../public/navIcons/Stats";
// Context
import { useStoreState } from "../store";

const routes = [
  { pathname: "/workoutLog", icon: <Notebook /> },
  { pathname: "/workoutBuilder", icon: <Builder /> },
  { pathname: "/workoutFeed", icon: <Feed /> },
  { pathname: "/myProfile", icon: <Stats /> },
];

export default function NavBar() {
  const { platform } = useStoreState();

  const router = useRouter();

  const ref = useRef(null);

  const [showNav, setShowNav] = useState(false);

  const clickOutListener = (e) => {
    if (ref.current && !ref.current.contains(e.target)) setShowNav(false);
  };

  useEffect(() => {
    setShowNav(false);
  }, [router.pathname]);

  useEffect(() => {
    document.addEventListener("click", clickOutListener);
    return () => document.removeEventListener("click", clickOutListener);
  }, []);

  return (
    <Nav
      ref={ref}
      className={`${showNav ? "show" : ""} ${platform === "ios" ? "ios-safe-area" : ""}`}
    >
      <NavBurger className={`burger ${showNav ? "open" : ""}`} onClick={() => setShowNav(!showNav)}>
        <span />
        <span />
        <span />
      </NavBurger>

      <NavIcons className={showNav ? "open" : "closed"}>
        {routes.map((route) => (
          <Link href={route.pathname} key={route.pathname}>
            <li className={router.pathname === route.pathname ? "selected" : ""}>
              <a>{route.icon}</a>
            </li>
          </Link>
        ))}
      </NavIcons>
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 99;
  pointer-events: none;

  &.ios-safe-area {
    padding-bottom: 15px;
  }
`;

const NavBurger = styled.div`
  background: ${({ theme }) => theme.background};
  border: 2px solid ${({ theme }) => theme.buttonLight};
  box-shadow: 0 -2px 6px ${({ theme }) => theme.boxShadow};

  height: 100px;
  width: 80px;
  border-radius: 10px 10px 0 0;
  padding-top: 10px;
  padding-bottom: 65px;
  transform: translateY(60px);
  margin: auto;
  pointer-events: all;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  span {
    transition: all 0.2s ease;
    width: 40%;
    height: 3px;
    border-radius: 5px;
    background: ${({ theme }) => theme.shades[5]};
  }

  &.open {
    span {
      background: ${({ theme }) => theme.textLight};

      &:nth-child(1) {
        transform: rotate(45deg) translateX(6px) translateY(5px);
        width: 40%;
      }
      &:nth-child(2) {
        transform: scale(0);
      }
      &:nth-child(3) {
        transform: rotate(-45deg) translateX(8px) translateY(-6px);
        width: 40%;
      }
    }
  }
`;

const NavIcons = styled.ul`
  position: absolute;
  width: 100%;
  height: 9rem;
  transition: all 0.25s ease-out;
  z-index: -1;
  pointer-events: all;
  transform-origin: bottom;

  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;

  li {
    border-radius: 10px;
    height: 65px;
    width: 65px;
    pointer-events: visible;

    fill: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.background};
    border: 2px solid ${({ theme }) => theme.buttonLight};
    box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

    display: flex;
    align-items: center;
    justify-content: center;

    &:nth-of-type(1) {
      margin-top: 1.5rem;
    }
    &:nth-of-type(2) {
      margin-bottom: 0rem;
    }
    &:nth-of-type(3) {
      margin-bottom: 0rem;
    }
    &:nth-of-type(4) {
      margin-top: 1.5rem;
    }
  }

  &.open {
    top: -1.8rem;
    background: linear-gradient(
      to top,
      ${({ theme }) => theme.opacityBackground} 10%,
      rgba(0, 0, 0, 0) 90%
    );

    opacity: 1;
  }
  &.closed {
    top: 6.5rem;
    opacity: 0;
  }
`;
