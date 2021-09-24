import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
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

  const { platform, user } = useStoreState();

  const ref = useRef<HTMLDivElement>(null);

  const [routes, setRoutes] = useState([
    { pathname: "/log", icon: <Notebook />, slug: "log" },
    { pathname: "/builder", icon: <Builder />, slug: "builder" },
    { pathname: "/feed", icon: <Search />, slug: "feed" },
    { pathname: `/users/${user!.username}`, icon: <Profile />, slug: "profile" },
  ]);
  const [currSlug, setCurrSlug] = useState("");

  useEffect(() => {
    const [activeRoute] = routes.filter((route) => router.asPath.includes(route.pathname));
    setCurrSlug(activeRoute?.slug || "");
  }, [router]);

  return (
    <Nav ref={ref} className={platform === "ios" ? "ios-safe-area" : ""}>
      <NavBarContainer>
        {routes.map(({ pathname, slug, icon }) => (
          <Link href={pathname} key={slug}>
            <li className={currSlug === slug ? "selected" : ""}>
              <a>{icon}</a>
              <p>{slug}</p>
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
  padding: 0.5rem 0 0;

  li {
    flex: 1;
    pointer-events: visible;

    fill: ${({ theme }) => theme.textLight};
    stroke: ${({ theme }) => theme.textLight};

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    p {
      font-size: 0.5rem;
      color: ${({ theme }) => theme.textLight};
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: -0.25rem;
    }

    &.selected {
      fill: ${({ theme }) => theme.text};
      stroke-width: 5px;
      stroke: ${({ theme }) => theme.text};
      p {
        color: ${({ theme }) => theme.text};
      }
    }
  }
`;
