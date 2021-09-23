import React from "react";
import { useCallback } from "react";
import styled from "styled-components";
// Context
import { useStoreState } from "../../store";
// Utils
import { addExerciseDataToLoggedWorkout, getCurrYearMonthDay } from "../../utils";
import { getWorkoutFromId } from "../../utils/api";
// Interfaces
import { WorkoutLogItem } from "../../utils/interfaces";
// Hooks
import useCountRenders from "../hooks/useCountRenders";

interface Props {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  setPageState: (dayData: WorkoutLogItem | null | undefined) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DateScrollClone: React.FC<Props> = ({
  selectedDate,
  setSelectedDate,
  setPageState,
  setLoading,
}) => {
  useCountRenders();

  const { user } = useStoreState();

  const makeDateString = (numOfDaysToShift: number) => {
    const { year, month, day } = getCurrYearMonthDay();
    // Current date
    const date = new Date(year, month, day);

    // Shifted date
    date.setDate(date.getDate() + numOfDaysToShift);

    const newDate = date.toISOString().substring(0, 10);

    return newDate;
  };

  const handleDateClick = async (numberOfDaysToShift: number) => {
    const newDate = makeDateString(numberOfDaysToShift);

    if (newDate !== selectedDate) {
      setLoading(true);

      setSelectedDate(newDate);

      // Find the workout for the new date
      const logItem = user?.workoutLog[newDate];

      if (logItem) {
        const workoutData = await getWorkoutFromId(logItem.workout_id);
        logItem.workout = workoutData || undefined;
        const composedWorkout = await addExerciseDataToLoggedWorkout(logItem);
        setPageState(composedWorkout);
      } else {
        setPageState(null);
      }
    }
  };

  // Format the date for the DateBar
  const renderDate = useCallback(
    (numOfDaysToShift: number) => {
      const newDate = makeDateString(numOfDaysToShift);

      const dayData = user?.workoutLog[newDate];

      const dayIsSelected = selectedDate === newDate;

      const displayDate = new Date(newDate + "T08:00:00.000Z").toDateString();

      return (
        <div
          className={`${dayIsSelected ? "selected" : "notSelected"} ${
            dayData ? "hasDayData" : "noDayData"
          }`}
        >
          <p className="dow">{displayDate.substring(0, 3)}</p>
          <p className="day">{displayDate.substring(8, 11)}</p>
        </div>
      );
    },
    [user?.workoutLog, selectedDate]
  );

  return (
    <DateScrollContainer>
      {Array.from(Array(90).keys()).map((numDays) => (
        <li onClick={() => handleDateClick(-numDays)} className="date" key={-numDays}>
          {renderDate(-numDays)}
        </li>
      ))}
    </DateScrollContainer>
  );
};
export default DateScrollClone;

const DateScrollContainer = styled.ul`
  display: flex;
  align-items: flex-end;
  flex-direction: row-reverse;

  width: calc(100% + 1rem);
  padding: 0.25rem 0 0.5rem;
  overflow-x: auto;

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
        font-weight: 400;
      }
      .day {
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
