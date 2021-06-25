import React from "react";
import styled from "styled-components";

export default function DateScroll({
  changeCurrentDayData,
  getDayDataFromWorkoutLog,
  yearMonthDay,
}) {
  // Format the date for the DateBar
  const formatDate = (numOfDaysToShift) => {
    const currDate = new Date();
    const date = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());

    date.setDate(date.getDate() + numOfDaysToShift);

    const dayData = getDayDataFromWorkoutLog(date.toISOString());

    const { year, month, day } = yearMonthDay;
    const dayIsSelected =
      date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;

    return (
      <div
        className={`${dayIsSelected ? "selected" : "notSelected"} ${
          dayData ? "hasDayData" : "noDayData"
        }`}
      >
        {date.getDate() === 1 && <h2>{String(date).substring(3, 7)}</h2>}
        <h5>{String(date).substring(0, 3)}</h5>
        <h3>{String(date).substring(8, 11)}</h3>
      </div>
    );
  };

  return (
    <DateScrollContainer>
      {[...Array(90).keys()].map((numDays) => (
        <li onClick={() => changeCurrentDayData(-numDays)} className="date" key={-numDays}>
          {formatDate(-numDays)}
        </li>
      ))}
    </DateScrollContainer>
  );
}

const DateScrollContainer = styled.ul`
  display: flex;
  align-items: flex-end;
  flex-direction: row-reverse;

  width: 100%;
  padding: 10px;
  overflow-x: scroll;

  .date {
    min-width: 60px;
    margin: 0 0.1rem;
    cursor: pointer;
    height: fit-content;
    text-align: center;

    div {
      border-radius: 10px;
      padding: 0.5rem;
      transition: all 0.2s ease-in-out;

      color: ${({ theme }) => theme.text};
      border: 1px solid ${({ theme }) => theme.border};
      box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

      h4,
      h5 {
        font-weight: 500;
        margin: 0.25rem;
      }
      h2 {
        font-weight: 400;
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
