import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import SavedWorkouts from "../components/feed/SavedWorkouts";
import PublicWorkouts from "../components/feed/PublicWorkouts";
import SearchBar from "../components/feed/SearchBar";
// Utils
import { getPublicWorkouts } from "../utils/api";
// Interfaces
import { Workout } from "../utils/interfaces";

export default function feed() {
  const [publicWorkouts, setPublicWorkouts] = useState<Workout[]>([]);
  const [searchCategory, setSearchCategory] = useState("workouts");

  useEffect(() => {
    const getAllPublicWorkouts = async () => {
      const workouts = await getPublicWorkouts();
      setPublicWorkouts(workouts);
    };

    getAllPublicWorkouts();
  }, []);

  return (
    <WorkoutFeedContainer>
      <SearchBar />

      <SearchCategories>
        <ul>
          {["workouts", "exercises", "users", "teams"].map((slug) => (
            <li
              key={slug}
              className={slug === searchCategory ? "highlight" : ""}
              onClick={() => setSearchCategory(slug)}
            >
              {slug}
            </li>
          ))}
        </ul>
      </SearchCategories>

      {searchCategory === "workouts" && <PublicWorkouts workouts={publicWorkouts} />}

      {/* <SavedWorkouts workouts={savedWorkouts} removeFromSavedWorkouts={removeFromSavedWorkouts} /> */}
    </WorkoutFeedContainer>
  );
}

const WorkoutFeedContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
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
      border: 1px solid ${({ theme }) => theme.buttonMed};
      transition: all 0.25s ease;

      &.highlight {
        border: 1px solid ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.text};
      }
    }
  }
`;
