import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import update from "immutability-helper";
// Interfaces
import { Workout } from "../../../types/interfaces";
// Components
import CustomWorkoutExercise from "./CustomWorkoutExercise";

interface Props {
  customWorkout: Workout;
  setCustomWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  removeExercise: (exercise_id: string) => void;
}

const CustomWorkout: React.FC<Props> = ({ customWorkout, setCustomWorkout, removeExercise }) => {
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
    const exerciseSetsLength = customWorkout.exercises[exerciseIndex].sets.length;

    switch (method) {
      case "add":
        if (exerciseSetsLength >= 100) break;

        // Add empty set to spedified exercise
        setCustomWorkout(
          update(customWorkout, {
            exercises: { [exerciseIndex]: { sets: { $push: [{ reps: 0, weight: -1 }] } } },
          })
        );
        break;
      case "remove":
        if (exerciseSetsLength === 1) break;
        // Remove last set from spedified exercise
        setCustomWorkout(
          update(customWorkout, {
            exercises: { [exerciseIndex]: { sets: { $splice: [[exerciseSetsLength - 1, 1]] } } },
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
          <CustomWorkoutList {...provided.droppableProps} ref={provided.innerRef}>
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
          </CustomWorkoutList>
        )}
      </Droppable>
    </>
  );
};
export default CustomWorkout;

const CustomWorkoutList = styled.ul`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
`;
