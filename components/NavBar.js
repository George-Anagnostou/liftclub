import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// Components
import Notebook from "../public/navIcons/Notebook";
import Builder from "../public/navIcons/Builder";
import Feed from "../public/navIcons/Feed";
import Stats from "../public/navIcons/Stats";
// Style Patch

const routes = [
  { pathname: "/workoutLog", icon: <Notebook /> },
  { pathname: "/workoutBuilder", icon: <Builder /> },
  { pathname: "/workoutFeed", icon: <Feed /> },
  { pathname: "/myProfile", icon: <Stats /> },
];

export default function NavBar() {
  const router = useRouter();

  const [showNav, setShowNav] = useState(false);
  const toggleNav = () => setShowNav(!showNav);

  return (
    <Nav>
      <NavBurger onClick={toggleNav} className={`burger ${showNav ? "" : "closed"}`}>
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
`;

const NavBurger = styled.nav`
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.buttonLight};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 -2px 4px ${({ theme }) => theme.boxShadow};

  height: 100px;
  width: 100px;
  border-radius: 50% 50% 0 0;
  padding-top: 10px;
  padding-bottom: 65px;
  transform: translateY(60px);
  margin: auto;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  span {
    transition: all 0.2s ease;
    width: 40%;
    height: 3px;
    border-radius: 5px;
    background: ${({ theme }) => theme.textLight};
  }

  &.open {
    span {
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
    pointer-events: visible;

    fill: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.buttonLight};
    border: 1px solid ${({ theme }) => theme.border};
    box-shadow: 0 2px 6px ${({ theme }) => theme.boxShadow};

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

  &.open {
    top: 0;
  }
  &.closed {
    top: 8vh;
    transform: scale(0);
    opacity: 0;
  }
`;
