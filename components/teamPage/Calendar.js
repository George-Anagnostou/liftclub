import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getCurrYearMonthDay } from "../../utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu ", "Fri", "Sat"];

export default function Calendar({ data, setSelectedDate, selectedDate }) {
  const [{ year, month, day }, setYearMonthDay] = useState(getCurrYearMonthDay());
  const [daysInMonth, setDaysInMonth] = useState(0);

  const isDayInData = (isoString) => data?.findIndex((item) => item.isoDate === isoString) > -1;

  const handleDayClick = (date) =>
    date === selectedDate ? setSelectedDate(null) : setSelectedDate(date);

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
            onClick={() => handleDayClick(new Date(year, month, i + 1).toISOString())}
            className={`day ${
              selectedDate === new Date(year, month, i + 1).toISOString() && "selected"
            }
            ${isDayInData(new Date(year, month, i + 1).toISOString()) && "hasWorkout"}
            ${
              selectedDate === new Date(year, month, i + 1).toISOString() &&
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
}

const Container = styled.div`
  margin: 0.5rem 0;
  border-radius: 5px;
  background: ${({ theme }) => theme.buttonMed};
`;

const MonthCtrl = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};

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
      font-weight: 100;
    }
  }

  .hasWorkout {
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accentText};
  }
  .selected {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
  .selectedAndHasWorkout {
    background: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accentText};
  }
`;
