import styled from "styled-components";
import { useState, useRef } from "react";
import Link from "next/link";
// Components
import Notebook from "../public/navIcons/Notebook";
import Builder from "../public/navIcons/Builder";
import Search from "../public/navIcons/Magnifying";
import Profile from "../public/navIcons/Profile";
import Create from "../public/navIcons/Create";
// Context
import { useStoreState } from "../store";

export default function NavBar() {
  const { platform, user } = useStoreState();

  const ref = useRef(null);

  const [routes, setRoutes] = useState([
    { pathname: "/workoutLog", icon: <Notebook />, slug: "log" },
    { pathname: "/workoutFeed", icon: <Search />, slug: "feed" },
    { pathname: "/builder", icon: <Create />, slug: "builder" },
    { pathname: `/users/${user.username}`, icon: <Profile />, slug: "profile" },
  ]);
  const [currSlug, setCurrSlug] = useState("log");

  return (
    <Nav ref={ref} className={platform === "ios" ? "ios-safe-area" : ""}>
      <NavBarContainer>
        {routes.map(({ pathname, slug, icon }) => (
          <Link href={pathname} key={slug}>
            <li className={currSlug === slug ? "selected" : ""} onClick={() => setCurrSlug(slug)}>
              <a>{icon}</a>
            </li>
          </Link>
        ))}
      </NavBarContainer>
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
    ul {
      padding-bottom: 25px;
    }
  }
`;

const NavBarContainer = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 -1px 4px ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.background};
  padding: 0.5rem 0;

  li {
    flex: 1;
    pointer-events: visible;

    fill: ${({ theme }) => theme.textLight};
    stroke: ${({ theme }) => theme.textLight};

    display: flex;
    align-items: center;
    justify-content: center;

    &.selected {
      fill: ${({ theme }) => theme.text};
      stroke: ${({ theme }) => theme.text};
    }
  }
`;
