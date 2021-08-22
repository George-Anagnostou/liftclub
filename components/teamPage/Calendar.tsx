import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Utils
import { getCurrYearMonthDay, areTheSameDate } from "../../utils";
// Interfaces
import { RoutineWorkoutPlanForCalendar, Workout } from "../../utils/interfaces";
import CalendarDay from "./CalendarDay";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
  data: RoutineWorkoutPlanForCalendar;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  selectedDate: string;
  selectedWorkout: Workout | null;
}

const Calendar: React.FC<Props> = ({ data, setSelectedDate, selectedDate, selectedWorkout }) => {
  const [{ year, month }, setYearMonthDay] = useState(getCurrYearMonthDay());
  const [daysInMonth, setDaysInMonth] = useState(0);

  const getDayData = (isoString: string) => {
    return data[isoString.substring(0, 10)];
  };

  const handleDayClick = (date: string) => {
    return areTheSameDate(date, selectedDate) ? setSelectedDate("") : setSelectedDate(date);
  };

  const incrementMonth = () => {
    const newMonth = (month + 1) % 12;
    newMonth === 0
      ? setYearMonthDay((prev) => ({ ...prev, month: newMonth, year: year + 1 }))
      : setYearMonthDay((prev) => ({ ...prev, month: newMonth }));

    setSelectedDate("");
  };

  const decrementMonth = () => {
    const newMonth = month - 1 < 0 ? 11 : month - 1;
    newMonth === 11
      ? setYearMonthDay((prev) => ({ ...prev, month: newMonth, year: year - 1 }))
      : setYearMonthDay((prev) => ({ ...prev, month: newMonth }));

    setSelectedDate("");
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

      <DaysOfTheWeek>
        <li>Sun</li>
        <li>Mon</li>
        <li>Tue</li>
        <li>Wed</li>
        <li>Thu</li>
        <li>Fri</li>
        <li>Sat</li>
      </DaysOfTheWeek>

      <DaysCtrl>
        {new Date(year, month, 0).getDay() > -1 &&
          [...Array(new Date(year, month, 0).getDay() + 1)].map((x, i) => (
            <div className="fillerDay" key={i}></div>
          ))}

        {[...Array(daysInMonth)].map((x, i) => (
          <CalendarDay
            key={i}
            dayData={getDayData(new Date(year, month, i + 1).toISOString())}
            handleDayClick={handleDayClick}
            year={year}
            month={month}
            day={i + 1}
            selectedDate={selectedDate}
            selectedWorkout={selectedWorkout}
          />
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
  justify-content: space-evenly;
  align-items: center;

  div {
    align-items: center;
    padding-bottom: 0.5rem;
    .month {
      font-size: 1.3rem;
      width: 150px;
    }
    .year {
      font-size: 0.7rem;
      color: ${({ theme }) => theme.textLight};
    }
  }
  .arrow {
    font-size: 1.4rem;
    font-weight: 300;
    color: ${({ theme }) => theme.textLight};
    background: ${({ theme }) => theme.body};
    height: 35px;
    width: 35px;
    border-radius: 8px;
    display: grid;
  }
`;

const DaysCtrl = styled.div`
  padding: 0.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
`;

const DaysOfTheWeek = styled.ul`
  display: flex;
  li {
    flex: 1;
    font-weight: 200;
    color: ${({ theme }) => theme.textLight};
  }
`;
