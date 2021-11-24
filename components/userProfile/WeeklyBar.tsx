import React from "react";
import styled from "styled-components";
import { User } from "../../types/interfaces";

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
        <div className="small-text">
          <p className="month">{String(date).substring(3, 8)}</p>
          <p className="day">{String(date).substring(8, 10)}</p>
        </div>
        <p className="dow">{String(date).substring(0, 3)}</p>
      </div>
    );
  };

  return (
    <DateScrollContainer>
      {[...Array(7).keys()].map((numDays) => (
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
  overflow: auto;

  .date {
    flex: 1;
    text-align: center;
    margin: 0 0.15rem;

    .small-text {
      font-weight: 300;
      margin: 0;
      font-size: 0.5rem;
      display: flex;
      justify-content: space-around;
    }

    .dow {
      margin-bottom: 0.05rem;
      font-size: 0.9rem;
      font-weight: 300;
    }

    div {
      border-radius: 8px;
      padding: 0.25rem 0.25rem;
      transition: all 0.2s ease-in-out;

      &.noDayData {
        background: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.textLight};
      }
      &.hasDayData {
        background: ${({ theme }) => theme.accent};
        color: ${({ theme }) => theme.accentText};
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
