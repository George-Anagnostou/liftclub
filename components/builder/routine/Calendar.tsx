import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Utils
import { getCurrYearMonthDay } from "../../../utils";
// Interfaces
import { RoutineWorkoutPlanForCalendar } from "../../../utils/interfaces";
// Components
import CalendarDay from "./CalendarDay";
import Garbage from "../../../public/navIcons/Garbage";
import Stack from "../../../public/navIcons/Stack";
import Copy from "../../../public/navIcons/Copy";
import Bubble from "../../../public/navIcons/Bubble";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
  data: RoutineWorkoutPlanForCalendar;
  datesSelected: { [date: string]: boolean };
  setDatesSelected: React.Dispatch<React.SetStateAction<{ [date: string]: boolean }>>;
  deleteSelectedDates?: () => void;
}

const Calendar: React.FC<Props> = ({
  data,
  datesSelected,
  setDatesSelected,
  deleteSelectedDates,
}) => {
  const router = useRouter();

  const [{ year, month }, setYearMonthDay] = useState(getCurrYearMonthDay());
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [showWorkoutTags, setShowWorkoutTags] = useState(true);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const getDayData = (isoString: string) => {
    return data[isoString.substring(0, 10)];
  };

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
      {router.pathname === "/builder" && (
        <Tools>
          <div onClick={deleteSelectedDates ? () => deleteSelectedDates() : () => {}}>
            <Garbage />
            <p>delete</p>
          </div>
          <div
            onClick={() => setMultiSelectMode(!multiSelectMode)}
            className={multiSelectMode ? "highlight" : ""}
          >
            <Stack />
            <p>multi</p>
          </div>
          <div>
            <Copy />
            <p>copy</p>
          </div>
          <div
            onClick={() => setShowWorkoutTags(!showWorkoutTags)}
            className={showWorkoutTags ? "highlight" : ""}
          >
            <Bubble />
            <p>tags</p>
          </div>
        </Tools>
      )}

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
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <li>{day}</li>
        ))}
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
            year={year}
            month={month + 1}
            day={i + 1}
            datesSelected={datesSelected}
            setDatesSelected={setDatesSelected}
            showWorkoutTags={showWorkoutTags}
            multiSelectMode={multiSelectMode}
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

const Tools = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0;
  border-bottom: 2px solid ${({ theme }) => theme.buttonMed};

  div {
    color: ${({ theme }) => theme.textLight};
    fill: ${({ theme }) => theme.textLight};
    background: ${({ theme }) => theme.buttonMed};
    padding: 0.25rem 0.5rem 0.1rem;
    border-radius: 5px;
    transition: all 0.25s ease;
    display: grid;
    place-items: center;
    box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
    font-size: 0.6rem;

    p {
      margin-top: 0.15rem;
    }

    &.highlight {
      background: ${({ theme }) => theme.border};
      color: ${({ theme }) => theme.text};
      fill: ${({ theme }) => theme.text};
    }
  }
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

const DaysOfTheWeek = styled.ul`
  display: flex;
  margin: 0 calc(0.25rem + 1.5px);

  li {
    flex: 1;
    font-weight: 200;
    color: ${({ theme }) => theme.textLight};
  }
`;

const DaysCtrl = styled.div`
  padding: 0.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
`;
