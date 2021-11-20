import React, { useState } from "react";
import { useCallback } from "react";
import styled from "styled-components";
// Context
import { useUserState } from "../../store";
// Utils
import { formatWorkoutLogKeyString } from "../../utils";
// Interfaces
import { WorkoutLogItem } from "../../types/interfaces";
import useInViewEffect from "../hooks/useInViewEffect";
import LoadingSpinner from "../LoadingSpinner";

interface Props {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  setPageState: (dayData: WorkoutLogItem | null | undefined) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  displayWorkoutLogItem: (logItem: WorkoutLogItem) => Promise<void>;
}

const DateScrollClone: React.FC<Props> = ({
  selectedDate,
  setSelectedDate,
  setPageState,
  setLoading,
  displayWorkoutLogItem,
}) => {
  const { user } = useUserState();

  const [dateCount, setDateCount] = useState(30);
  const infiniteScrollRef = useInViewEffect(() => setDateCount((prev) => prev + 30));

  const handleDateClick = async (numberOfDaysToShift: number) => {
    const newDate = formatWorkoutLogKeyString(numberOfDaysToShift);
    if (newDate !== selectedDate) {
      setLoading(true);
      setSelectedDate(newDate);
      // Find the log item for the new date and display it
      const logItem = user?.workoutLog[newDate];
      logItem ? displayWorkoutLogItem(logItem) : setPageState(null);
    }
  };

  // Format the date for the DateBar
  const renderDate = useCallback(
    (numOfDaysToShift: number) => {
      const newDate = formatWorkoutLogKeyString(numOfDaysToShift);
      const dayData = user?.workoutLog[newDate];
      const dayIsSelected = selectedDate === newDate;
      const displayDate = new Date(newDate + "T08:00:00.000Z").toDateString();

      return (
        <div
          className={`date-container ${dayIsSelected ? "selected" : "notSelected"} ${
            dayData ? "hasDayData" : "noDayData"
          }`}
        >
          <div className="small-text">
            <p className="month">{displayDate.substring(3, 8)}</p>
            <p className="day">{displayDate.substring(8, 10)}</p>
          </div>
          <p className="dow">{displayDate.substring(0, 3)}</p>
        </div>
      );
    },
    [user?.workoutLog, selectedDate]
  );

  return (
    <DateScrollContainer>
      {Array.from(Array(dateCount).keys()).map((numDays) => (
        <Day onClick={() => handleDateClick(-numDays)} key={-numDays}>
          {renderDate(-numDays)}
        </Day>
      ))}

      <li ref={infiniteScrollRef}>
        <LoadingSpinner />
      </li>
    </DateScrollContainer>
  );
};
export default DateScrollClone;

const Day = styled.li`
  min-width: 55px;
  margin: 0 0.1rem;
  cursor: pointer;
  height: fit-content;
  text-align: center;

  .date-container {
    border-radius: 8px;
    padding: 0.5rem 0.25rem 0.25rem;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

    .small-text {
      font-weight: 300;
      margin: 0;
      font-size: 0.6rem;
      display: flex;
      justify-content: space-around;
    }

    .dow {
      margin-bottom: 0.25rem;
      font-size: 1.2rem;
    }

    &.selected {
      background: ${({ theme }) => theme.background};
    }
    &.notSelected {
      transform: scale(0.8);
      background: ${({ theme }) => theme.background};
      color: ${({ theme }) => theme.textLight};
    }
    &.hasDayData {
      background: ${({ theme }) => theme.accent};
      color: ${({ theme }) => theme.accentText};
      .small-text {
        color: ${({ theme }) => theme.accentText};
      }
      .dow {
        color: ${({ theme }) => theme.accentText};
      }
    }
    &.noDayData {
    }
  }
`;

const DateScrollContainer = styled.ul`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;

  width: calc(100% + 1rem);
  padding: 0.25rem 0 0.5rem;
  overflow-x: auto;

  @media (max-width: 425px) {
    /* Remove scroll bar on mobile */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
