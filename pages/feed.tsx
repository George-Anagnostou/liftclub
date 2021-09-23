import { useState } from "react";
import styled from "styled-components";
// Components
import SearchBar from "../components/feed/SearchBar";
import PublicWorkouts from "../components/feed/PublicWorkouts";
import UsersResults from "../components/feed/UsersResults";

/**
 * TODO:
 *
 * The display for a feed is comprised of:
 *  - curated categories of workouts to pick from
 *  - top 6 reccomended workouts
 *  - users with the most workouts created
 *  - teams available to join
 *
 */

export default function feed() {
  const [searchCategory, setSearchCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");

  return (
    <WorkoutFeedContainer>
      <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <SearchCategories>
        <ul>
          {["workouts", "users", "exercises", "teams"].map((slug) => (
            <li
              key={slug}
              className={slug === searchCategory ? "highlight" : ""}
              onClick={() =>
                searchCategory === slug ? setSearchCategory("") : setSearchCategory(slug)
              }
            >
              {slug}
            </li>
          ))}
        </ul>
      </SearchCategories>

      <section
        style={
          searchCategory === "workouts" || searchCategory === ""
            ? { display: "block" }
            : { display: "none" }
        }
      >
        <Title style={searchCategory === "" ? { height: "1.5rem" } : { height: 0, opacity: 0 }}>
          Workouts
        </Title>
        <PublicWorkouts searchInput={searchInput} limit={searchCategory === "" ? 6 : 0} />
      </section>

      <section
        style={
          searchCategory === "users" || searchCategory === ""
            ? { display: "block" }
            : { display: "none" }
        }
      >
        <Title style={searchCategory === "" ? { height: "1.5rem" } : { height: 0, opacity: 0 }}>
          Users
        </Title>
        <UsersResults searchInput={searchInput} limit={searchCategory === "" ? 5 : 0} />
      </section>
    </WorkoutFeedContainer>
  );
}

const WorkoutFeedContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Section = styled.section`
  transition: height 0.35s ease;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.textLight};
  text-align: left;
  margin: 0.25rem 0.5rem 0;
  font-weight: 300;
  font-size: 1rem;
  transition: height 0.2s ease-out, opacity 0.1s ease;
`;

const SearchCategories = styled.div`
  background: ${({ theme }) => theme.background};
  box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
  position: sticky;
  top: 0.5rem;
  z-index: 99;
  padding: 0 0 0.5rem;

  ul {
    display: flex;
    height: 100%;
    width: 100%;
    max-width: 100%;
    overflow-x: scroll;

    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Safari and Chrome */
    }

    li {
      font-size: 0.75rem;
      background: ${({ theme }) => theme.background};
      padding: 0.25rem 1.5rem;
      margin: 0 0.25rem;
      font-weight: 300;
      color: ${({ theme }) => theme.textLight};
      border-radius: 20px;
      text-transform: capitalize;
      border: 1px solid ${({ theme }) => theme.border};
      transition: all 0.25s ease;

      &.highlight {
        border: 1px solid ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.text};
      }
    }
  }
`;
