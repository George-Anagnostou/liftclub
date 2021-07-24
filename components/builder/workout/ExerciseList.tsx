import { useState, useEffect } from "react";
import styled from "styled-components";
import useSWR from "swr";
// Context
import { useStoreState } from "../../../store";
// Interfaces
import { Exercise } from "../../../utils/interfaces";
// Components
import LoadingSpinner from "../../LoadingSpinner";
import CreateExerciseModal from "./CreateExerciseModal";
import ExerciseListItem from "./ExerciseListItem";

interface Props {
  isExerciseInCustomWorkout: (exercise_id: string) => boolean;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exercise_id: string) => void;
  setShowExerciseList: React.Dispatch<React.SetStateAction<boolean>>;
}

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((r) => r.json());

const ExerciseList: React.FC<Props> = ({
  isExerciseInCustomWorkout,
  addExercise,
  removeExercise,
  setShowExerciseList,
}) => {
  const { data, error } = useSWR("/api/exercises", fetcher);

  const { user } = useStoreState();

  const [searchTerm, setSearchTerm] = useState("");
  const [displayedExercises, setDisplayedExercises] = useState<Exercise[]>([]);
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);

  const handleSearchTermChange = (e) => setSearchTerm(e.target.value);

  const filterExercisesBy = (term: string) => {
    if (term) {
      const filtered = data.filter((exercise: Exercise) => {
        const { _id, ...no_id } = exercise;
        return Object.values(no_id).some((val) => val.toLowerCase().includes(term.toLowerCase()));
      });

      setDisplayedExercises(filtered);
    } else {
      const alphabetical = data.sort((a: Exercise, b: Exercise) => {
        if (a.name.toLowerCase().charAt(0) < b.name.toLowerCase().charAt(0)) return -1;
        if (a.name.toLowerCase().charAt(0) > b.name.toLowerCase().charAt(0)) return 1;
        return 0;
      });

      setDisplayedExercises(alphabetical);
    }
  };

  useEffect(() => {
    if (data) filterExercisesBy(searchTerm);
  }, [searchTerm, data]);

  // Error catch for SWR
  if (error) return <h1>failed to load</h1>;

  return (
    <ExercisesContainer>
      <header>
        <input
          type="text"
          name="searchTerm"
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="Search"
        />

        {user?.isTrainer && <button onClick={() => setShowCreateExerciseModal(true)}>Add</button>}

        <button onClick={() => setShowExerciseList(false)}>Close</button>
      </header>

      {showCreateExerciseModal && (
        <CreateExerciseModal
          setShowModal={setShowCreateExerciseModal}
          showModal={showCreateExerciseModal}
        />
      )}

      {data ? (
        <ul>
          {displayedExercises.map((exercise) => (
            <ExerciseListItem
              key={exercise._id}
              exercise={exercise}
              isExerciseInCustomWorkout={isExerciseInCustomWorkout}
              removeExercise={removeExercise}
              addExercise={addExercise}
            />
          ))}
        </ul>
      ) : (
        <LoadingSpinner />
      )}
    </ExercisesContainer>
  );
};
export default ExerciseList;

const ExercisesContainer = styled.div`
  border: none;
  max-height: 100%;
  width: 95%;
  margin: auto;
  overflow-y: scroll;
  overflow-x: hidden;

  header {
    position: sticky;
    top: 0.5rem;

    background: ${({ theme }) => theme.buttonLight};
    width: 100%;
    margin-bottom: 0.5rem;
    border-radius: 5px;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      flex: 3;
      width: 100%;
      font-size: 1rem;
      margin: 0.25rem 0.1rem 0.25rem 0.25rem;
      padding: 0.5rem;
      border: none;
      border-radius: 5px;
      color: ${({ theme }) => theme.text};
      background: ${({ theme }) => theme.background};
    }

    button {
      flex: 1;
      font-size: 1rem;
      color: ${({ theme }) => theme.textLight};
      background: ${({ theme }) => theme.background};
      border: none;
      margin: 0.25rem 0.1rem;
      border-radius: 5px;
      padding: 0.5rem;
    }
    padding-right: 0.15rem;
  }

  ul {
    margin: 1rem 0.5rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
