import React from "react";
import styled from "styled-components";

import { Workout } from "../../../utils/interfaces";

interface Props {
  dayData: { workout_id: string; workout: Workout };
  year: number;
  month: number;
  day: number;
  datesSelected: { [date: string]: boolean };
  setDatesSelected: React.Dispatch<React.SetStateAction<{ [date: string]: boolean }>>;
  showWorkoutTags: boolean;
  multiSelectMode: boolean;
}

const CalendarDay: React.FC<Props> = ({
  dayData,
  year,
  month,
  day,
  datesSelected,
  setDatesSelected,
  showWorkoutTags,
  multiSelectMode,
}) => {
  const formatDate = (y: string | number, m: string | number, d: string | number) => {
    y = y.toString();
    m = m.toString();
    d = d.toString();
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const handleTouchStart = () => {
    if (!multiSelectMode) setDatesSelected({});
  };

  const handleTouchMove = (e) => {
    var touch = e.touches[0] || e.changedTouches[0];

    var realTarget: any | null = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!realTarget) return;

    if (
      realTarget.classList.contains("date") &&
      !datesSelected[formatDate(year, month, realTarget.innerText)]
    ) {
      setDatesSelected((prev) => ({
        ...prev,
        [formatDate(year, month, realTarget.innerText)]: true,
      }));
    }
  };

  const handleClick = () => {
    if (multiSelectMode) {
      // If day is already selected, remove it
      datesSelected[formatDate(year, month, day)]
        ? setDatesSelected((prev) => {
            var copy = Object.assign({}, prev);
            delete copy[formatDate(year, month, day)];
            return copy;
          })
        : setDatesSelected((prev) => ({ ...prev, [formatDate(year, month, day)]: true }));
    } else {
      // TODO This is supposed to remove the day if it is currently selected, otherwise make it the only day selected
      // The onTouchStart function is preventing this from working properly
      datesSelected[formatDate(year, month, day)] && Object.keys(datesSelected).length === 1
        ? setDatesSelected((prev) => {
            var copy = Object.assign({}, prev);
            delete copy[formatDate(year, month, day)];
            return copy;
          })
        : setDatesSelected({ [formatDate(year, month, day)]: true });
    }
  };

  return (
    <Container
      className={`day 
    ${datesSelected[formatDate(year, month, day)] && "selected"}
    ${dayData && "hasWorkout"}
    ${datesSelected[formatDate(year, month, day)] && dayData && "selectedAndHasWorkout"}
    `}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
    >
      {showWorkoutTags && datesSelected[formatDate(year, month, day)] && dayData && (
        <>
          <div className="workoutName shadow">
            <p>{dayData.workout.name}</p>
            <span />
          </div>
          <div className="workoutName">
            <p>{dayData.workout.name}</p>
            <span />
          </div>
        </>
      )}

      <div className="date">{day}</div>
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
  touch-action: none;

  .date {
    display: grid;
    place-items: center;
    height: 40px;
    padding-bottom: 4px;
    font-weight: 500;
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
    animation-name: fadeInUp;

    @keyframes fadeInUp {
      from {
        top: -20px;
        opacity: 0;
      }

      to {
        top: -25px;
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

    &.shadow {
      top: -22.5px !important;
      left: calc(50% - 1.5px);
      background: ${({ theme }) => theme.shades[5]};

      p {
        opacity: 0;
      }
      span:after {
        border-top-color: ${({ theme }) => theme.shades[5]};
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
