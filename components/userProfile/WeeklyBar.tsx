import React from "react";
import styled from "styled-components";
import { User } from "../../utils/interfaces";

interface Props {
  profileData: User;
}

const WeeklyBar: React.FC<Props> = ({ profileData }) => {
  // Format the date for the DateBar
  const renderDate = (numOfDaysToShift: number) => {
    const currDate = new Date();
    const date = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());

    date.setDate(date.getDate() + numOfDaysToShift);

    const dayData = profileData.workoutLog[date.toISOString().substring(0, 10)];

    return (
      <div className={dayData ? "hasDayData" : "noDayData"}>
        <p>{String(date).substring(0, 3)}</p>
        <p>{String(date).substring(8, 11)}</p>
      </div>
    );
  };

  return (
    <DateScrollContainer>
      {Array.from(Array(7).keys()).map((numDays) => (
        <li className="date" key={-numDays}>
          {renderDate(-numDays)}
        </li>
      ))}
    </DateScrollContainer>
  );
};
export default WeeklyBar;

const DateScrollContainer = styled.ul`
  display: flex;
  align-items: flex-end;
  flex-direction: row-reverse;
  width: 100%;

  .date {
    flex: 1;
    height: fit-content;
    text-align: center;
    margin: 0 0.25rem;

    &:last-child {
      margin: 0 0.25rem 0 0;
    }
    &:first-child {
      margin: 0 0 0 0.25rem;
    }

    div {
      border-radius: 10px;
      padding: 0.5rem 0rem;
      transition: all 0.2s ease-in-out;

      color: ${({ theme }) => theme.text};

      p {
        margin: 0.2rem 0;
      }

      &.hasDayData {
        background: ${({ theme }) => theme.accent};
        color: ${({ theme }) => theme.accentText};
      }
      &.noDayData {
        background: ${({ theme }) => theme.background};
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
