import { useState, useEffect } from "react";
import styled from "styled-components";
import useSWR from "swr";
// Context
import { useUserState } from "../../../store";
// Interfaces
import { Exercise } from "../../../types/interfaces";
// Components
import CreateExerciseModal from "./CreateExerciseModal";
import ExerciseListItem from "./ExerciseListItem";

interface Props {
  isExerciseInCustomWorkout: (exercise_id: string) => boolean;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exercise_id: string) => void;
  setExerciseListBottom: React.Dispatch<React.SetStateAction<number>>;
  exerciseListBottom: number;
}

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((r) => r.json());

const ExerciseList: React.FC<Props> = ({
  isExerciseInCustomWorkout,
  addExercise,
  removeExercise,
  setExerciseListBottom,
  exerciseListBottom,
}) => {
  const { user } = useUserState();

  const { data, error } = useSWR("/api/exercises", fetcher);

  const [searchTerm, setSearchTerm] = useState("");
  const [displayedExercises, setDisplayedExercises] = useState<Exercise[]>([]);
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);

  const handleTouchMove = (e) => {
    const screenHeight = e.view.innerHeight;
    const thumbY = e.touches[0].clientY;
    const thumbVH = ((screenHeight - thumbY) / screenHeight) * 100 - 80;
    if (thumbVH <= 0) setExerciseListBottom(thumbVH);
  };

  const handleTouchEnd = () => {
    exerciseListBottom <= -20 ? setExerciseListBottom(-80) : setExerciseListBottom(0);
  };

  const handleSearchTermChange = (e) => setSearchTerm(e.target.value);

  const filterExercisesBy = (term: string) => {
    if (term) {
      const filtered = data.filter((exercise: Exercise) => {
        const { _id, ...no_id } = exercise;
        return Object.values(no_id).some((val) => val.toLowerCase().includes(term.toLowerCase()));
      });

      setDisplayedExercises(filtered);
    } else {
      const alphabetical = data.sort((a: Exercise, b: Exercise) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      setDisplayedExercises(alphabetical);
    }
  };

  useEffect(() => {
    if (data) filterExercisesBy(searchTerm);
  }, [searchTerm, data]);

  useEffect(() => {
    if (exerciseListBottom === -80) document.body.style.overflow = "auto";
    else document.body.style.overflow = "hidden";
  }, [exerciseListBottom]);

  // Error catch for SWR
  if (error) return <h1>failed to load</h1>;

  return (
    <>
      <ExercisesContainer
        style={{ bottom: exerciseListBottom + "vh" }}
        className={exerciseListBottom === 0 || exerciseListBottom === -80 ? "transition" : ""}
      >
        <header>
          <div className="thumb-line" onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            <span />
          </div>

          <SearchInput>
            <input
              type="text"
              name="searchTerm"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="Search"
            />

            {user?.isTrainer && (
              <button onClick={() => setShowCreateExerciseModal(true)}>Create</button>
            )}

            <button onClick={() => setExerciseListBottom(-80)}>Close</button>
          </SearchInput>
        </header>

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
      </ExercisesContainer>

      {showCreateExerciseModal && (
        <CreateExerciseModal
          setShowModal={setShowCreateExerciseModal}
          showModal={showCreateExerciseModal}
        />
      )}
    </>
  );
};
export default ExerciseList;

const ExercisesContainer = styled.div`
  height: 75vh;
  width: 100%;
  max-width: 700px;
  margin-left: -0.5rem;
  overflow-y: auto;
  border-radius: 20px 20px 0 0;
  position: fixed;
  display: flex;
  flex-direction: column;
  z-index: 990;
  transition: bottom 0.05s ease-out;

  &.transition {
    transition: bottom 0.25s ease-out;
  }

  header {
    box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
    position: sticky;
    top: 0;
    border-top: 2px solid ${({ theme }) => theme.border};
    border-left: 2px solid ${({ theme }) => theme.border};
    border-right: 2px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.background};
    border-radius: 25px 25px 2px 2px;
    width: 100%;

    padding-right: 0.15rem;

    .thumb-line {
      width: 100%;
      padding: 0.5rem 0 1rem;
      touch-action: none;

      span {
        width: 40%;
        height: 7px;
        border-radius: 5px;
        background: ${({ theme }) => theme.buttonLight};
        display: block;
        margin: auto;
        touch-action: none;
      }
    }
  }

  ul {
    background: ${({ theme }) => theme.buttonMed};
    border-left: 2px solid ${({ theme }) => theme.boxShadow};
    border-right: 2px solid ${({ theme }) => theme.boxShadow};
    flex: 1;
    padding: 1rem 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .loadingContainer {
    margin-top: 2rem;
  }
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  input {
    flex: 4;
    width: 100%;
    font-size: 1rem;
    margin: 0.25rem 0.1rem 0.5rem 0.25rem;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 5px;
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.buttonMed};
    border: 1px solid ${({ theme }) => theme.buttonMed};
    appearance: none;
    &:focus {
      outline: none;
      border: 1px solid ${({ theme }) => theme.accentSoft};
    }
  }

  button {
    flex: 1;
    font-size: 0.7rem;
    color: ${({ theme }) => theme.textLight};
    background: ${({ theme }) => theme.buttonMed};
    border: none;
    margin: 0.25rem 0.1rem 0.5rem 0.25rem;
    border-radius: 5px;
    padding: 0.5rem;
  }
`;
