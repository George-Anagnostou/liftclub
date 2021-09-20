import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import PublicWorkoutTile from "./PublicWorkoutTile";
// Interfaces
import { Workout } from "../../utils/interfaces";
// API
import { addSavedWorkout, removeSavedWorkout } from "../../store/actions/userActions";
import { getPublicWorkouts } from "../../utils/api";
import { useStoreDispatch, useStoreState } from "../../store";

interface Props {
  searchInput: string;
}

const PublicWorkouts: React.FC<Props> = ({ searchInput }) => {
  const { user } = useStoreState();
  const dispatch = useStoreDispatch();

  const [initialWorkouts, setInitialWorkouts] = useState<Workout[]>([]);
  const [searchResults, setSearchResults] = useState<Workout[]>([]);

  const addToSavedWorkouts = (workout: Workout) => {
    addSavedWorkout(dispatch, user!._id, workout._id);
  };

  const removeFromSavedWorkouts = (workout: Workout) => {
    removeSavedWorkout(dispatch, user!._id, workout._id);
  };

  const sortWorkoutsBy = (keyword: "popular" | "recent" | "name") => {
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
      default:
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
  }, [searchInput]);

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
        <li onClick={() => sortWorkoutsBy("recent")}>Recent</li>
        <li onClick={() => sortWorkoutsBy("popular")}>Popular</li>
        <li onClick={() => sortWorkoutsBy("name")}>A — Z</li>
      </SortOptions>

      <ul>
        {Boolean(searchResults.length)
          ? searchResults.map((workout, i) => (
              <PublicWorkoutTile
                isLoading={!Boolean(initialWorkouts.length)}
                key={`public${workout._id}${i}`}
                workout={workout}
                removeFromSavedWorkouts={removeFromSavedWorkouts}
                addToSavedWorkouts={addToSavedWorkouts}
              />
            ))
          : searchInput && <li>No results</li>}
      </ul>
    </Container>
  );
};
export default PublicWorkouts;

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

    &.highlight {
    }
  }
`;
