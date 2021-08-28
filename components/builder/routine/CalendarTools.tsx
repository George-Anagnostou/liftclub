import React from "react";
import styled from "styled-components";
// Icons
import Garbage from "../../svg/Garbage";
import Stack from "../../svg/Stack";
import Copy from "../../svg/Copy";
import Bubble from "../../svg/Bubble";
import Reset from "../../svg/Reset";

interface Props {
  datesSelected: { [date: string]: boolean };
  deleteSelectedDates: (() => void) | undefined;
  setDatesSelected: React.Dispatch<React.SetStateAction<{ [date: string]: boolean }>>;
  multiSelectMode: boolean;
  setMultiSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
  showWorkoutTags: boolean;
  setShowWorkoutTags: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalendarTools: React.FC<Props> = ({
  datesSelected,
  deleteSelectedDates,
  setDatesSelected,
  multiSelectMode,
  setMultiSelectMode,
  showWorkoutTags,
  setShowWorkoutTags,
}) => {
  return (
    <Tools>
      <div
        onClick={deleteSelectedDates ? () => deleteSelectedDates() : () => {}}
        className={Object.keys(datesSelected).length ? "highlight" : ""}
      >
        <Garbage />
        <p>delete</p>
      </div>
      <div
        onClick={() => setDatesSelected({})}
        className={Object.keys(datesSelected).length ? "highlight" : ""}
      >
        <Reset />
        <p>reset</p>
      </div>
      <div
        onClick={() => setMultiSelectMode(!multiSelectMode)}
        className={multiSelectMode ? "highlight" : ""}
      >
        <Stack />
        <p>multi</p>
      </div>
      <div>
        <Copy />
        <p>copy</p>
      </div>
      <div
        onClick={() => setShowWorkoutTags(!showWorkoutTags)}
        className={showWorkoutTags ? "highlight" : ""}
      >
        <Bubble />
        <p>tags</p>
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
    background: ${({ theme }) => theme.buttonMed};
    padding: 0.25rem 0.5rem 0.1rem;
    border-radius: 5px;
    transition: all 0.25s ease;
    display: grid;
    place-items: center;
    box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
    font-size: 0.6rem;

    p {
      margin-top: 0.15rem;
    }

    &.highlight {
      background: ${({ theme }) => theme.border};
      color: ${({ theme }) => theme.text};
      fill: ${({ theme }) => theme.text};
    }
  }
`;
