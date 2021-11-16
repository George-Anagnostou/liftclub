import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import WorkoutTile from "./WorkoutTile";
// Interfaces
import { Workout } from "../../types/interfaces";
// API
import { addSavedWorkout, removeSavedWorkout } from "../../store/actions/userActions";
import { getPublicWorkouts } from "../../api-lib/fetchers";
import { useUserDispatch, useUserState } from "../../store";

interface Props {
  searchInput: string;
  limit: number;
}

const WorkoutsResults: React.FC<Props> = ({ searchInput, limit }) => {
  const { user } = useUserState();
  const dispatch = useUserDispatch();

  const [initialWorkouts, setInitialWorkouts] = useState<Workout[]>([]);
  const [searchResults, setSearchResults] = useState<Workout[]>([]);
  const [sortingMethod, setSortingMethod] = useState("recent");

  const addToSavedWorkouts = (workout: Workout) => {
    addSavedWorkout(dispatch, user!._id, workout._id);
  };

  const removeFromSavedWorkouts = (workout: Workout) => {
    removeSavedWorkout(dispatch, user!._id, workout._id);
  };

  const sortWorkoutsBy = (keyword: "popular" | "recent" | "name") => {
    setSortingMethod(keyword);

    switch (keyword) {
      case "popular":
        setSearchResults([...searchResults].sort((a, b) => b.numLogged - a.numLogged));
        break;
      case "recent":
        setSearchResults(
          [...searchResults].sort((a, b) => b.date_created.localeCompare(a.date_created))
        );
        break;
      case "name":
        setSearchResults([...searchResults].sort((a, b) => a.name.localeCompare(b.name)));
        break;
    }
  };

  useEffect(() => {
    if (searchInput === "") {
      setSearchResults(initialWorkouts);
    } else {
      setSearchResults(
        [...initialWorkouts].filter(
          (workout) =>
            workout.name.toLowerCase().includes(searchInput.toLocaleLowerCase()) ||
            workout.creatorName.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
  }, [searchInput, initialWorkouts]);

  useEffect(() => {
    const getAllPublicWorkouts = async () => {
      const publicWorkouts = await getPublicWorkouts();
      setSearchResults(publicWorkouts);
      setInitialWorkouts(publicWorkouts);
    };
    setSearchResults(new Array(15).fill({}));
    getAllPublicWorkouts();
  }, []);

  return (
    <Container>
      <SortOptions>
        <li
          onClick={() => sortWorkoutsBy("recent")}
          className={sortingMethod === "recent" ? "highlight" : ""}
        >
          Recent
        </li>
        <li
          onClick={() => sortWorkoutsBy("popular")}
          className={sortingMethod === "popular" ? "highlight" : ""}
        >
          Popular
        </li>
        <li
          onClick={() => sortWorkoutsBy("name")}
          className={sortingMethod === "name" ? "highlight" : ""}
        >
          A — Z
        </li>
      </SortOptions>

      <ul>
        {Boolean(searchResults.length)
          ? searchResults
              .slice(0, limit || searchResults.length)
              .map(
                (workout, i) =>
                  workout && (
                    <WorkoutTile
                      key={workout._id || i}
                      i={i}
                      isLoading={!Boolean(initialWorkouts.length)}
                      workout={workout}
                      removeFromSavedWorkouts={removeFromSavedWorkouts}
                      addToSavedWorkouts={addToSavedWorkouts}
                    />
                  )
              )
          : searchInput && <p style={{ margin: "1rem 0", fontWeight: 300 }}>No results</p>}
      </ul>
    </Container>
  );
};
export default WorkoutsResults;

const Container = styled.section`
  width: 100%;
  flex: 1;
`;

const SortOptions = styled.ul`
  display: flex;
  align-items: center;
  padding: 0.5rem 0 0;
  color: ${({ theme }) => theme.textLight};
  li {
    font-size: 0.75rem;
    margin: 0 0.5rem;
    padding: 0.1rem 1rem;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 5px;
    cursor: pointer;

    &.highlight {
      border: 1px solid ${({ theme }) => theme.accentSoft};
    }
  }
`;
