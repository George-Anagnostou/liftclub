import styled from "styled-components";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
// Components
import Notebook from "./svg/Notebook";
import Search from "./svg/Magnifying";
import Profile from "./svg/Profile";
// import Create from "../public/navIcons/Create";
// Context
import { useStoreState } from "../store";
import Builder from "./svg/Builder";

const NavBar: React.FC = () => {
  const router = useRouter();

  const getSlugFromUrl = () => {
    switch (router.route.split("/")[1]) {
      case "log":
        return "log";
      case "feed":
        return "feed";
      case "builder":
        return "builder";
      case "users":
        return "profile";
      default:
        return "log";
    }
  };

  const { platform, user } = useStoreState();

  const ref = useRef<HTMLDivElement>(null);

  const [routes, setRoutes] = useState([
    { pathname: "/log", icon: <Notebook />, slug: "log" },
    { pathname: "/builder", icon: <Builder />, slug: "builder" },
    { pathname: "/feed", icon: <Search />, slug: "feed" },
    { pathname: `/users/${user!.username}`, icon: <Profile />, slug: "profile" },
  ]);
  const [currSlug, setCurrSlug] = useState(() => getSlugFromUrl());

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
};
export default NavBar;

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
      stroke-width: 5px;
      stroke: ${({ theme }) => theme.text};
    }
  }
`;
