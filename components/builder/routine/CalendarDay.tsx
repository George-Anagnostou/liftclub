import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { areTheSameDate } from "../../../utils";
import { Workout } from "../../../utils/interfaces";

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
        <p>{day}</p>
      </div>
    </Container>
  );
};
export default CalendarDay;

const Container = styled.div`
  border-radius: 5px;
  padding-top: 5px;
  margin: 1.5px;
  background: ${({ theme }) => theme.buttonLight};
  color: ${({ theme }) => theme.textLight};
  position: relative;
  user-select: none;
  transition: border-radius 0.25s ease-out;

  .date {
    display: grid;
    place-items: center;
    height: 40px;

    p {
      font-weight: 500;
      padding-bottom: 4px;
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
    top: -25px;
    left: 50%;
    transform: translateX(-50%);

    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};

    animation-duration: 0.3s;
    animation-fill-mode: both;
    opacity: 0;
    animation-name: fadeInUp;

    @keyframes fadeInUp {
      from {
        transform: translate3d(-50%, 5px, 0);
      }

      to {
        transform: translate3d(-50%, 0, 0);
        opacity: 1;
      }
    }

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
        border-top-color: ${({ theme }) => theme.border};
        border-bottom: 0;
        margin-left: -15px;
        margin-bottom: -15px;
      }
    }
  }

  &.selected {
    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    border-radius: 15px;
  }
  &.hasWorkout {
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accentText};
  }
  &.selectedAndHasWorkout {
    background: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accentText};
    border-radius: 15px;
  }
`;
