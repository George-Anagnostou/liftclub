import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Utils
import { getCurrYearMonthDay } from "../../../utils";
// Interfaces
import { RoutineWorkoutPlanForCalendar, Routine } from "../../../utils/interfaces";
// Components
import CalendarDay from "./CalendarDay";
import CalendarTools from "./CalendarTools";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
  data: RoutineWorkoutPlanForCalendar;
  datesSelected: { [date: string]: boolean };
  setDatesSelected: React.Dispatch<React.SetStateAction<{ [date: string]: boolean }>>;
  deleteWorkoutsOnSelectedDates?: () => void;
  undoRoutineStack?: Routine[];
  undoRoutine?: () => void;
  selectedDaysFromPlan: Routine["workoutPlan"];
  copyWorkoutsToStartDate?: (date: string) => void;
}

const Calendar: React.FC<Props> = ({
  data,
  datesSelected,
  setDatesSelected,
  deleteWorkoutsOnSelectedDates,
  undoRoutineStack,
  undoRoutine,
  selectedDaysFromPlan,
  copyWorkoutsToStartDate,
}) => {
  const router = useRouter();

  const [showWorkoutTags, setShowWorkoutTags] = useState(true);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [moveWorkoutsMode, setMoveWorkoutsMode] = useState(false);
  const [{ year, month }, setYearMonthDay] = useState(getCurrYearMonthDay());
  const [daysInMonth, setDaysInMonth] = useState(0);

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
        <CalendarTools
          datesSelected={datesSelected}
          deleteWorkoutsOnSelectedDates={deleteWorkoutsOnSelectedDates}
          setDatesSelected={setDatesSelected}
          multiSelectMode={multiSelectMode}
          setMultiSelectMode={setMultiSelectMode}
          showWorkoutTags={showWorkoutTags}
          setShowWorkoutTags={setShowWorkoutTags}
          moveWorkoutsMode={moveWorkoutsMode}
          setMoveWorkoutsMode={setMoveWorkoutsMode}
          undoRoutineStack={undoRoutineStack}
          undoRoutine={undoRoutine}
          selectedDaysFromPlan={selectedDaysFromPlan}
        />
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
          <li key={day}>{day}</li>
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
            moveWorkoutsMode={moveWorkoutsMode}
            copyWorkoutsToStartDate={copyWorkoutsToStartDate}
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
    margin-bottom: 0.5rem;

    .month {
      font-size: 1.3rem;
      width: 150px;
      font-weight: 200;
    }
    .year {
      font-size: 0.6rem;
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
    font-size: 0.85rem;
    color: ${({ theme }) => theme.textLight};
  }
`;

const DaysCtrl = styled.div`
  padding: 0.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
`;
