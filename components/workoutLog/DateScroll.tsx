import React from "react";
import { useCallback } from "react";
import styled from "styled-components";
// Context
import { useUserState } from "../../store";
// Utils
import { addExerciseDataToLoggedWorkout, getCurrYearMonthDay } from "../../utils";
import { getWorkoutFromId } from "../../utils/api";
// Interfaces
import { WorkoutLogItem } from "../../utils/interfaces";

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
  const { user } = useUserState();

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
          className={`date-container ${dayIsSelected ? "selected" : "notSelected"} ${
            dayData ? "hasDayData" : "noDayData"
          }`}
        >
          <div className="small-text">
            <p className="month">{displayDate.substring(3, 8)}</p>
            <p className="day">{displayDate.substring(8, 11)}</p>
          </div>
          <p className="dow">{displayDate.substring(0, 3)}</p>
        </div>
      );
    },
    [user?.workoutLog, selectedDate]
  );

  return (
    <DateScrollContainer>
      {Array.from(Array(90).keys()).map((numDays) => (
        <Day onClick={() => handleDateClick(-numDays)} key={-numDays}>
          {renderDate(-numDays)}
        </Day>
      ))}
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
  align-items: flex-end;
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
