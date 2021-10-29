import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import update from "immutability-helper";
// Interfaces
import { Workout } from "../../../utils/interfaces";
// Components
import CustomWorkoutExercise from "./CustomWorkoutExercise";

interface Props {
  customWorkout: Workout;
  setCustomWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  removeExercise: (exercise_id: string) => void;
  setExerciseListBottom: React.Dispatch<React.SetStateAction<number>>;
}

const CustomWorkout: React.FC<Props> = ({
  customWorkout,
  setCustomWorkout,
  removeExercise,
  setExerciseListBottom,
}) => {
  // Update the reps for specified set
  const handleRepChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    exerciseIndex: number,
    setIndex: number
  ) => {
    const num = Number(e.target.value || 0);

    setCustomWorkout(
      update(customWorkout, {
        exercises: { [exerciseIndex]: { sets: { [setIndex]: { reps: { $set: num } } } } },
      })
    );
  };

  const handleSetChange = (method: "add" | "remove", exerciseIndex: number) => {
    switch (method) {
      case "add":
        if (customWorkout.exercises[exerciseIndex].sets.length >= 100) break;

        // Add empty set to spedified exercise
        setCustomWorkout(
          update(customWorkout, {
            exercises: { [exerciseIndex]: { sets: { $push: [{ reps: 0, weight: -1 }] } } },
          })
        );
        break;
      case "remove":
        // Remove last set from spedified exercise
        setCustomWorkout(
          update(customWorkout, {
            exercises: {
              [exerciseIndex]: {
                sets: { $splice: [[customWorkout.exercises[exerciseIndex].sets.length - 1, 1]] },
              },
            },
          })
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Droppable droppableId={"workout"}>
        {(provided) => (
          <ExerciseList {...provided.droppableProps} ref={provided.innerRef}>
            {customWorkout.exercises.map(
              ({ exercise, sets }, i) =>
                exercise && (
                  <CustomWorkoutExercise
                    key={exercise._id}
                    exerciseIndex={i}
                    sets={sets}
                    exercise={exercise}
                    handleSetChange={handleSetChange}
                    handleRepChange={handleRepChange}
                    removeExercise={removeExercise}
                  />
                )
            )}
            {provided.placeholder}
          </ExerciseList>
        )}
      </Droppable>

      <AddExerciseBtn onClick={() => setExerciseListBottom(0)}>
        <p>Add Exercise</p>
      </AddExerciseBtn>
    </>
  );
};
export default CustomWorkout;

const ExerciseList = styled.ul`
  width: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  position: relative;
`;

const AddExerciseBtn = styled.button`
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.accentText};
  box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
  border: none;
  width: fit-content;
  margin: 0.5rem auto 0.5rem;
  padding: 0.25rem 2rem;
  font-weight: 300;

  border-radius: 5px;
  font-size: 1.1rem;
`;
