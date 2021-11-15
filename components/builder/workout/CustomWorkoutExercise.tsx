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

          <ul>
            {sets.map(({ reps }, j) => (
              <RepsInput key={j}>
                <span className="rep-num">{j + 1}</span>
                <input
                  type="number"
                  name="reps"
                  value={reps || ""}
                  placeholder={"0"}
                  onChange={(e) => handleRepChange(e, exerciseIndex, j)}
                />
                <span className="reps-tag">reps</span>
              </RepsInput>
            ))}
          </ul>
        </ExerciseItem>
      )}
    </Draggable>
  );
};
export default CustomWorkoutExercise;

const ExerciseItem = styled.li`
  border-radius: 5px;
  box-shadow: 0 2px 3px ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.background};
  width: 100%;
  margin-bottom: 0.5rem;
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
          margin: 0.15rem;
          display: block;
          background: ${({ theme }) => theme.accentSoft};
        }
      }
      .name {
        flex: 1;
        font-size: 1rem;
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
      input {
        border: 2px solid ${({ theme }) => theme.buttonLight};
        border-bottom: 2px solid ${({ theme }) => theme.accentSoft};
      }
    }
  }
`;

const RepsInput = styled.li`
  margin: 0.25rem;
  padding: 0.25rem;
  background: ${({ theme }) => theme.buttonMed};
  border-radius: 5px;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  .rep-num {
    border: 2px solid ${({ theme }) => theme.border};
    border-radius: 50%;
    height: 30px;
    width: 30px;
    display: grid;
    place-items: center;
  }

  input {
    appearance: none;
    width: 5rem;
    font-size: 1.25rem;
    margin: 0 0.75rem 0.2rem;
    background: inherit;
    color: ${({ theme }) => theme.text};
    text-align: center;
    border-radius: 0;
    border: 2px solid ${({ theme }) => theme.buttonMed};
    border-bottom: 2px solid ${({ theme }) => theme.accentSoft};
    &:focus {
      outline: none;
      border-radius: 3px;
      border: 2px solid ${({ theme }) => theme.accentSoft};
    }
  }
  .reps-tag {
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
    margin-bottom: -4px;
    margin-top: auto;
    font-size: 0.8rem;
  }
`;
