import React from "react";
import styled from "styled-components";
// Interface
import { Routine } from "../../../types/interfaces";
// Icons
import Garbage from "../../svg/Garbage";
import Stack from "../../svg/Stack";
import Copy from "../../svg/Copy";
import Bubble from "../../svg/Bubble";
import Reset from "../../svg/Reset";
import Undo from "../../svg/Undo";

interface Props {
  selectedDaysFromPlan?: Routine["workoutPlan"];
  datesSelected: { [date: string]: boolean };
  deleteWorkoutsOnSelectedDates?: () => void;
  setDatesSelected: React.Dispatch<React.SetStateAction<{ [date: string]: boolean }>>;
  multiSelectMode: boolean;
  setMultiSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
  showWorkoutTags: boolean;
  setShowWorkoutTags: React.Dispatch<React.SetStateAction<boolean>>;
  copyWorkoutsMode: boolean;
  setCopyWorkoutsMode: React.Dispatch<React.SetStateAction<boolean>>;
  undoRoutineStack?: Routine[];
  undoRoutine?: () => void;
}

const CalendarTools: React.FC<Props> = ({
  selectedDaysFromPlan,
  datesSelected,
  deleteWorkoutsOnSelectedDates,
  setDatesSelected,
  multiSelectMode,
  setMultiSelectMode,
  showWorkoutTags,
  setShowWorkoutTags,
  copyWorkoutsMode,
  setCopyWorkoutsMode,
  undoRoutineStack,
  undoRoutine,
}) => {
  return (
    <Tools>
      <div
        onClick={deleteWorkoutsOnSelectedDates ? () => deleteWorkoutsOnSelectedDates() : () => {}}
        className={Object.keys(selectedDaysFromPlan!).length ? "highlight" : ""}
      >
        <Garbage />
        <p>delete</p>
      </div>

      <div
        onClick={() => {
          setDatesSelected({});
          setCopyWorkoutsMode(false);
        }}
        className={Object.keys(datesSelected).length ? "highlight" : ""}
      >
        <Reset />
        <p>Deselect</p>
      </div>

      <div
        onClick={() => setShowWorkoutTags(!showWorkoutTags)}
        className={showWorkoutTags ? "highlight" : ""}
      >
        <Bubble />
        <p>tags</p>
      </div>

      <div
        onClick={() => setMultiSelectMode(!multiSelectMode)}
        className={multiSelectMode ? "accent" : ""}
      >
        <Stack />
        <p>multi</p>
      </div>

      <div onClick={undoRoutine} className={undoRoutineStack?.length ? "highlight" : ""}>
        <Undo />
        <p>undo</p>
      </div>

      <div
        onClick={() => setCopyWorkoutsMode(!copyWorkoutsMode)}
        className={` ${Object.keys(selectedDaysFromPlan!).length && "highlight"} ${
          copyWorkoutsMode && "accent"
        }`}
      >
        <Copy />
        <p>copy</p>
      </div>
    </Tools>
  );
};

export default CalendarTools;

const Tools = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 0.5rem 0;
  border-bottom: 2px solid ${({ theme }) => theme.buttonMed};

  div {
    color: ${({ theme }) => theme.textLight};
    fill: ${({ theme }) => theme.textLight};
    stroke: ${({ theme }) => theme.textLight};
    background: ${({ theme }) => theme.buttonMed};
    padding: 0.25rem 0.5rem 0.1rem;
    border-radius: 5px;
    transition: all 0.15s ease;
    display: grid;
    place-items: center;
    font-size: 0.5rem;
    box-shadow: 0 1px 1px ${({ theme }) => theme.boxShadow};
    cursor: pointer;

    p {
      margin-top: 0.15rem;
    }

    svg {
      transform: scale(0.9);
    }

    &.highlight {
      background: ${({ theme }) => theme.border};
      color: ${({ theme }) => theme.text};
      fill: ${({ theme }) => theme.text};
      stroke: ${({ theme }) => theme.text};
    }
    &.accent {
      background: ${({ theme }) => theme.accentSoft};
      color: ${({ theme }) => theme.accentText};
      fill: ${({ theme }) => theme.accentText};
      stroke: ${({ theme }) => theme.accentText};
    }
  }
`;
