import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import useSWR from "swr";
import { matchSorter } from "match-sorter";
import { getExercisesByUserId } from "../../../api-lib/fetchers";
// Context
import { useUserState } from "../../../store";
// Interfaces
import { Exercise } from "../../../types/interfaces";
// Components
import CreateExerciseModal from "./CreateExerciseModal";
import ExerciseListItem from "./ExerciseListItem";
import TextInput from "../../Wrappers/TextInput";

interface Props {
  isExerciseInCustomWorkout: (exercise_id: string) => boolean;
  addExercise: (exercise: Exercise) => void;
  removeExercise?: (exercise_id: string) => void;
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

  const { data, error } = useSWR("/api/exercises", fetcher) as { data: Exercise[]; error: any };

  const [defaultExercises, setDefaultExercises] = useState<Exercise[]>([]);
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
  const [userExercises, setUserExercises] = useState<Exercise[]>([]);
  const [displayedList, setDisplayedList] = useState<"default" | "created">("default");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (term: string) => setSearchTerm(term);

  const dragList = (e) => {
    const screenHeight = e.view.innerHeight;
    const thumbY = e.touches[0].clientY;
    const thumbVH = ((screenHeight - thumbY) / screenHeight) * 100 - 80;
    if (thumbVH <= 0) setExerciseListBottom(thumbVH);
  };

  const checkToCloseList = () => {
    exerciseListBottom <= -20 ? setExerciseListBottom(-80) : setExerciseListBottom(0);
  };

  const filterExercisesBy = (term: string, exercises: Exercise[]) => {
    if (term) {
      // Return any Exercise with search term in any data
      return matchSorter(
        exercises.filter(({ _id, creator_id, isDefault, ...no_id }: Exercise) =>
          Object.values(no_id).some((val) => val.toLowerCase().includes(term.toLowerCase()))
        ),
        term,
        { keys: ["name", "equipment", "muscleGroup", "muscleWorked", "metric"] }
      );
    } else {
      // Sort alphabetically by name
      return matchSorter(
        exercises.sort((a: Exercise, b: Exercise) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        ),
        term,
        { keys: ["name"] }
      );
    }
  };

  useEffect(() => {
    if (data) {
      const filtededDefault = filterExercisesBy(searchTerm, data);
      setDefaultExercises(filtededDefault);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    async function getUserExercises() {
      const userExercises = await getExercisesByUserId(user!._id);
      const filteredUserExercises = filterExercisesBy(searchTerm, userExercises);
      setUserExercises(filteredUserExercises);
    }
    if (user) getUserExercises();
  }, [searchTerm, user]);

  useEffect(() => {
    if (exerciseListBottom === -80) document.body.style.overflow = "auto";
    else document.body.style.overflow = "hidden";
  }, [exerciseListBottom]);

  // Error catch for SWR
  if (error) return <h1>Failed to load.</h1>;

  return (
    <>
      <ExercisesContainer
        bottomVh={exerciseListBottom + "vh"}
        className={exerciseListBottom === 0 || exerciseListBottom === -80 ? "transition" : ""}
      >
        <Header xPos={displayedList === "default" ? 0 : 50}>
          <div className="thumb-line" onTouchMove={dragList} onTouchEnd={checkToCloseList}>
            <span />
          </div>

          <SearchInput>
            <TextInput
              onChange={(term) => handleSearchTermChange(term)}
              inputName={"Search Term"}
              placeholder={"Search an exercise"}
            />

            <button onClick={() => setShowCreateExerciseModal(true)}>New Exercise</button>

            <button className="close-btn" onClick={() => setExerciseListBottom(-80)}>
              Close
            </button>
          </SearchInput>

          <div className="list-options">
            <p
              onClick={() => setDisplayedList("default")}
              className={displayedList === "default" ? "selected" : ""}
            >
              Explore
            </p>
            <p
              onClick={() => setDisplayedList("created")}
              className={displayedList === "created" ? "selected" : ""}
            >
              My Exercises
            </p>
          </div>
        </Header>

        <ul>
          {displayedList === "default" &&
            defaultExercises.map((exercise) => (
              <ExerciseListItem
                key={`defualt-${exercise._id}`}
                exercise={exercise}
                isExerciseInCustomWorkout={isExerciseInCustomWorkout}
                removeExercise={removeExercise}
                addExercise={addExercise}
                deletable={false}
              />
            ))}
          {displayedList === "created" &&
            userExercises.map((exercise) => (
              <ExerciseListItem
                key={`created-${exercise._id}`}
                exercise={exercise}
                isExerciseInCustomWorkout={isExerciseInCustomWorkout}
                removeExercise={removeExercise}
                addExercise={addExercise}
                deletable={true}
                setExercises={setUserExercises}
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

const ExercisesContainer = styled.div<{ bottomVh: string }>`
  height: 75vh;
  width: 100vw;
  max-width: 700px;
  overflow-y: auto;
  border-radius: 30px 30px 0 0;
  position: fixed;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 990;
  transition: bottom 0.05s ease-in-out;
  bottom: ${({ bottomVh }) => bottomVh};
  box-shadow: ${({ bottomVh }) => (bottomVh === "0vh" ? "0 -50vh 100vh black;" : "none")};

  &.transition {
    transition: bottom 0.2s ease-in-out;
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
`;

const Header = styled.header<{ xPos: number }>`
  box-shadow: 0 3px 6px ${({ theme }) => theme.boxShadow};
  position: sticky;
  top: 0;
  border-top: 2px solid ${({ theme }) => theme.border};
  border-left: 2px solid ${({ theme }) => theme.border};
  border-right: 2px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 30px 30px 2px 2px;
  width: 100%;
  z-index: 2;

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
  .list-options {
    display: flex;
    justify-content: space-around;
    height: fit-content;

    p {
      flex: 1;
      padding: 0.5rem 0;
      font-weight: 400;
      font-size: 0.85rem;
      text-transform: uppercase;
      color: ${({ theme }) => theme.textLight};
      background: ${({ theme }) => theme.background};
      transition: all 0.2s ease;
      height: 2.5rem;

      &.selected {
        color: ${({ theme }) => theme.text};
      }
    }

    ${({ xPos }) => css`
      &::after {
        pointer-events: none;
        transition: all 0.2s ease;
        content: "";
        left: ${xPos}%;
        position: absolute;
        height: 2.5rem;
        width: 50%;
        border-radius: 5px 5px 0 0;
        background-color: ${({ theme }) => theme.medOpacity};
        box-shadow: inset 0 0 3px ${({ theme }) => theme.accent},
          0 4px 4px ${({ theme }) => theme.boxShadow};
      }
    `}
  }
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.25rem 0 0.5rem;

  button {
    font-weight: 400;
    color: ${({ theme }) => theme.textLight};
    background: ${({ theme }) => theme.buttonMed};
    border: none;
    margin: 0 0.1rem 0 0.25rem;
    border-radius: 5px;
    padding: 0.5rem 0.5rem;
    min-width: max-content;
  }

  .close-btn {
    margin-right: 0.25rem;
  }
`;
