import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
// Interfaces
import { Exercise } from "../../../utils/interfaces";
// Icons
import Garbage from "../../svg/Garbage";

interface Props {
  exerciseIndex: number;
  sets: {
    reps: number;
    weight: number;
  }[];
  exercise: Exercise;
  handleSetChange: (method: "add" | "remove", exerciseIndex: number) => void;
  handleRepChange: (e: any, exerciseIndex: number, setIndex: number) => void;
  removeExercise: (exercise_id: string) => void;
}

const CustomWorkoutExercise: React.FC<Props> = ({
  exerciseIndex,
  sets,
  exercise,
  handleSetChange,
  handleRepChange,
  removeExercise,
}) => {
  return (
    <Draggable draggableId={exercise._id} index={exerciseIndex}>
      {(provided, snapshot) => (
        <ExerciseItem
          className={snapshot.isDragging ? "dragging" : ""}
          data-key={exercise._id.toString()}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="header">
            <div className="title">
              <span {...provided.dragHandleProps} className="drag-handle">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <p className="name">{exercise.name}</p>
            </div>

            <div className="buttons">
              <div className="setControl">
                <button className="removeBtn" onClick={() => removeExercise(exercise._id)}>
                  <Garbage />
                </button>

                <button
                  onClick={() => handleSetChange("remove", exerciseIndex)}
                  disabled={!Boolean(sets.length)}
                >
                  -
                </button>

                <button
                  onClick={() => handleSetChange("add", exerciseIndex)}
                  disabled={sets.length >= 100}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <RepsList className="reps-list">
            {sets.map(({ reps }, j) => (
              <RepListItem key={j}>
                <span>{j + 1}.</span>
                <input
                  type="number"
                  name="reps"
                  value={reps || ""}
                  placeholder={"0"}
                  onChange={(e) => handleRepChange(e, exerciseIndex, j)}
                />
                <span>reps</span>
              </RepListItem>
            ))}
          </RepsList>
        </ExerciseItem>
      )}
    </Draggable>
  );
};
export default CustomWorkoutExercise;

const ExerciseItem = styled.li`
  border-radius: 5px;
  box-shadow: 0 0 5px ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.background};
  width: 100%;
  margin: 0.5rem 0;
  text-align: center;
  position: relative;

  user-select: none;

  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      flex: 3;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      text-align: left;
      color: ${({ theme }) => theme.textLight};
      padding: 0.5rem;

      .drag-handle {
        max-width: min-content;
        font-size: 1rem;
        margin-right: 0.6rem;
        display: flex;
        flex-direction: column;

        span {
          height: 2px;
          width: 20px;
          margin: 0.1rem;
          display: block;
          background: ${({ theme }) => theme.accentSoft};
        }
      }
      .name {
        flex: 1;
        font-size: 1.2rem;
        text-transform: capitalize;
      }
    }

    .buttons {
      padding: 0.5rem 0;

      .setControl {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 0.2rem;

        p {
          margin: 0 0.5rem;
        }
        button {
          flex: 1;
          border: none;
          background: ${({ theme }) => theme.accentSoft};
          color: ${({ theme }) => theme.accentText};
          border-radius: 10px;
          height: 2.25rem;
          width: 2.25rem;
          margin: 0 0.3rem;
          font-size: 1.5rem;
          transition: all 0.3s ease;

          &:disabled {
            color: ${({ theme }) => theme.border};
            background: ${({ theme }) => theme.buttonMed};
          }
        }

        .removeBtn {
          fill: ${({ theme }) => theme.textLight};
          border: none;
          background: ${({ theme }) => theme.buttonMed};
          display: grid;
          place-items: center;
        }
      }
    }
  }

  &.dragging {
    background: ${({ theme }) => theme.buttonMed};
    .title {
      color: ${({ theme }) => theme.text};
    }

    li {
      background: ${({ theme }) => theme.buttonLight};
    }
  }
`;

const RepsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
`;

const RepListItem = styled.li`
  margin: 0.2rem;
  flex: 1;
  min-width: 150px;
  width: fit-content;
  background: ${({ theme }) => theme.buttonMed};
  padding: 0.5rem;
  border-radius: 5px;

  display: flex;
  align-items: center;
  justify-content: space-evenly;

  input {
    width: 3rem;
    font-size: 1.25rem;
    padding: 0.25rem 0;
    margin: 0 0.25rem;
    background: inherit;
    color: inherit;
    text-align: center;
    border-radius: 0;
    border: none;
    border-bottom: 2px solid ${({ theme }) => theme.accentSoft};
  }
  span {
    font-weight: 300;
    font-size: 0.9rem;
  }
`;
