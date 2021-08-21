import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { areTheSameDate } from "../../utils";
import { Workout } from "../../utils/interfaces";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu ", "Fri", "Sat"];

interface Props {
  dayData: { workout_id: string; workout: Workout };
  handleDayClick: (date: string) => void;
  year: number;
  month: number;
  day: number;
  selectedDate: string;
  selectedWorkout: Workout | null;
}

const CalendarDay: React.FC<Props> = ({
  dayData,
  handleDayClick,
  year,
  month,
  day,
  selectedDate,
  selectedWorkout,
}) => {
  const [dayIsSelected, setDayIsSelected] = useState<boolean>(false);

  useEffect(() => {
    setDayIsSelected(areTheSameDate(selectedDate, new Date(year, month, day).toISOString()));
  }, [selectedDate]);

  return (
    <Container
      onClick={() => handleDayClick(new Date(year, month, day).toISOString().substring(0, 10))}
      className={`day 
      ${dayIsSelected && "selected"}
      ${dayData && "hasWorkout"}
      ${dayIsSelected && dayData && "selectedAndHasWorkout"}
      `}
    >
      {dayIsSelected && dayData && (
        <div className="workoutName">
          <p>{selectedWorkout?.name}</p>
          <span />
        </div>
      )}

      <div className="date">
        <p>{DAYS[new Date(year, month, day).getDay()]}</p>
        <p>{day}</p>
      </div>
    </Container>
  );
};
export default CalendarDay;

const Container = styled.div`
  border-radius: 3px;
  padding: 3px 0;
  margin: 1px;
  background: ${({ theme }) => theme.buttonLight};
  color: ${({ theme }) => theme.textLight};
  position: relative;
  user-select: none;

  .date {
    font-size: 0.8rem;
    font-weight: 500;
    p {
      padding: 0;
      margin: 0;
      height: 25px;
    }
  }

  .workoutName {
    display: flex;
    flex-direction: column;
    pointer-events: none;

    font-size: 0.85rem;
    font-weight: 200;

    max-width: 150px;
    padding: 0.25rem;
    z-index: 99;
    border-radius: 3px;

    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);

    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};

    p {
      overflow-x: hidden;
      overflow-y: visible;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 500;
    }

    span {
      height: 0;
      width: 0;
      margin: 0 auto;
      position: relative;

      &:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 0;
        border: 15px solid transparent;
        border-top-color: ${({ theme }) => theme.body};
        border-bottom: 0;
        margin-left: -15px;
        margin-bottom: -15px;
      }
    }
  }

  &.selected {
    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
  }
  &.hasWorkout {
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accentText};
  }
  &.selectedAndHasWorkout {
    background: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accentText};
  }
`;
