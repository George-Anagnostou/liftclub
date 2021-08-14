import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Utils
import { getCurrYearMonthDay, stripTimeAndCompareDates } from "../../utils";
// Interfaces
import { Routine } from "../../utils/interfaces";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu ", "Fri", "Sat"];

interface Props {
  data: Routine["workoutPlan"];
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  selectedDate: string;
}

const Calendar: React.FC<Props> = ({ data, setSelectedDate, selectedDate }) => {
  const [{ year, month }, setYearMonthDay] = useState(getCurrYearMonthDay());
  const [daysInMonth, setDaysInMonth] = useState(0);

  const isDayInData = (isoString: string) =>
    data?.findIndex((item) => item.isoDate.substring(0, 10) === isoString.substring(0, 10)) > -1;

  const handleDayClick = (date: string) =>
    stripTimeAndCompareDates(date, selectedDate) ? setSelectedDate("") : setSelectedDate(date);

  const incrementMonth = () => {
    const newMonth = (month + 1) % 12;
    newMonth === 0
      ? setYearMonthDay((prev) => ({ ...prev, month: newMonth, year: year + 1 }))
      : setYearMonthDay((prev) => ({ ...prev, month: newMonth }));
  };

  const decrementMonth = () => {
    const newMonth = month - 1 < 0 ? 11 : month - 1;
    newMonth === 11
      ? setYearMonthDay((prev) => ({ ...prev, month: newMonth, year: year - 1 }))
      : setYearMonthDay((prev) => ({ ...prev, month: newMonth }));
  };

  useEffect(() => {
    if (year && month > -1) setDaysInMonth(new Date(year, month + 1, 0).getDate());
  }, [year, month]);

  return (
    <Container>
      <MonthCtrl>
        <div className="arrow" onClick={decrementMonth}>
          {"<"}
        </div>
        <div onClick={() => setYearMonthDay(getCurrYearMonthDay())}>
          <p className="month">{MONTHS[month]}</p>
          <p className="year">{year}</p>
        </div>
        <div className="arrow" onClick={incrementMonth}>
          {">"}
        </div>
      </MonthCtrl>

      <DaysCtrl>
        {new Date(year, month, 0).getDay() > -1 &&
          [...Array(new Date(year, month, 0).getDay() + 1)].map((x, i) => (
            <div className="fillerDay" key={i}></div>
          ))}

        {[...Array(daysInMonth)].map((x, i) => (
          <div
            key={i}
            onClick={() =>
              handleDayClick(new Date(year, month, i + 1).toISOString().substring(0, 10))
            }
            className={`day ${
              stripTimeAndCompareDates(selectedDate, new Date(year, month, i + 1).toISOString()) &&
              "selected"
            }
            ${isDayInData(new Date(year, month, i + 1).toISOString()) && "hasWorkout"}
            ${
              stripTimeAndCompareDates(selectedDate, new Date(year, month, i + 1).toISOString()) &&
              isDayInData(new Date(year, month, i + 1).toISOString()) &&
              "selectedAndHasWorkout"
            }`}
          >
            <span>
              {DAYS[new Date(year, month, i + 1).getDay()]}
              <br />
              {i + 1}
            </span>
          </div>
        ))}
      </DaysCtrl>
    </Container>
  );
};
export default Calendar;

const Container = styled.div`
  border-radius: 5px;
  background: ${({ theme }) => theme.background};
`;

const MonthCtrl = styled.div`
  width: 100%;
  display: flex;

  div {
    flex: 1;
    align-items: center;
    padding: 0.5rem;
    .month {
      font-size: 1.1rem;
    }
    .year {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.textLight};
    }
  }
  .arrow {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;

const DaysCtrl = styled.div`
  padding: 0.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;

  .day {
    border-radius: 3px;
    padding: 3px 0;
    margin: 1px;
    background: ${({ theme }) => theme.buttonLight};
    color: ${({ theme }) => theme.textLight};

    span {
      font-size: 0.75rem;
      font-weight: 200;
    }
  }

  .hasWorkout {
    background: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accentText};
  }
  .selected {
    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
  }
  .selectedAndHasWorkout {
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accentText};
  }
`;
