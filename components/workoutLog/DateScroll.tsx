import React from "react";
import { useCallback } from "react";
import styled from "styled-components";
// Interfaces
import { WorkoutLog, WorkoutLogItem } from "../../utils/interfaces";
import useCountRenders from "../hooks/useCountRenders";

interface Props {
  changeCurrentDayData: (numOfDaysToShift: number) => Promise<void>;
  getDayDataFromWorkoutLog: (targetIsoDate: string) => WorkoutLogItem | undefined;
  displayedDate: {
    year: number;
    month: number;
    day: number;
  };
  workoutLog: WorkoutLog;
}

const DateScroll: React.FC<Props> = ({
  changeCurrentDayData,
  getDayDataFromWorkoutLog,
  displayedDate,
  workoutLog,
}) => {
  useCountRenders();

  // Format the date for the DateBar
  const renderDate = useCallback(
    (numOfDaysToShift: number) => {
      const currDate = new Date();
      const date = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());

      date.setDate(date.getDate() + numOfDaysToShift);

      const dayData = getDayDataFromWorkoutLog(date.toISOString());

      const { year, month, day } = displayedDate;
      const dayIsSelected =
        date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;

      return (
        <div
          className={`${dayIsSelected ? "selected" : "notSelected"} ${
            dayData ? "hasDayData" : "noDayData"
          }`}
        >
          {date.getDate() === 1 && <p className="month">{String(date).substring(3, 7)}</p>}
          <p className="dow">{String(date).substring(0, 3)}</p>
          <p className="day">{String(date).substring(8, 11)}</p>
        </div>
      );
    },
    [workoutLog, displayedDate]
  );

  return (
    <DateScrollContainer>
      {Array.from(Array(90).keys()).map((numDays) => (
        <li onClick={() => changeCurrentDayData(-numDays)} className="date" key={-numDays}>
          {renderDate(-numDays)}
        </li>
      ))}
    </DateScrollContainer>
  );
};
export default DateScroll;

const DateScrollContainer = styled.ul`
  display: flex;
  align-items: flex-end;
  flex-direction: row-reverse;

  width: calc(100% + 1rem);
  padding: 0.25rem 0 0.5rem;
  overflow-x: scroll;

  .date {
    min-width: 55px;
    margin: 0 0.1rem;
    cursor: pointer;
    height: fit-content;
    text-align: center;

    div {
      border-radius: 10px;
      padding: 0.25rem;
      transition: all 0.2s ease-in-out;

      color: ${({ theme }) => theme.text};
      box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

      p {
        font-weight: 200;
        margin: 0.25rem 0;
      }

      .month {
        text-transform: uppercase;
      }
      .dow {
        font-weight: 600;
      }
      .day {
      }

      &.selected {
        background: ${({ theme }) => theme.buttonMed};
      }
      &.notSelected {
        transform: scale(0.85);
        transform-origin: bottom;
        background: ${({ theme }) => theme.background};
      }
      &.hasDayData {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.shades[1]};
      }
      &.noDayData {
      }
    }
  }

  @media (max-width: 425px) {
    /* Remove scroll bar on mobile */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
