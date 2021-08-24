import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
// Context
import { useStoreState } from "../../store";
// Utils
import { getRoutineFromId } from "../../utils/api";
import { formatRoutineWorkoutPlanForCalendar } from "../../utils/dataMutators";
// Components
import Calendar from "../builder/routine/Calendar";
// Interface
import { Routine } from "../../utils/interfaces";

interface Props {
  routine_id: string;
}

const RoutineContainer: React.FC<Props> = ({ routine_id }) => {
  const { user } = useStoreState();

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [datesSelected, setDatesSelected] = useState({});

  // Get the routine data from DB
  useEffect(() => {
    const getRoutineData = async () => {
      const routineData = await getRoutineFromId(routine_id);

      if (routineData) setRoutine(routineData);
    };

    if (!routine) getRoutineData();
  }, [routine]);

  return (
    <>
      {routine && (
        <CalendarContainer>
          <h3 className="title">Schedule</h3>

          {user?._id === routine.creator_id && (
            <Link href={`/builder?builder=routine&routine=${routine_id}`}>
              <button className="editBtn">Edit</button>
            </Link>
          )}

          <Calendar
            data={formatRoutineWorkoutPlanForCalendar(routine.workoutPlan)}
            datesSelected={datesSelected}
            setDatesSelected={setDatesSelected}
          />
        </CalendarContainer>
      )}
    </>
  );
};
export default RoutineContainer;

const CalendarContainer = styled.div`
  background: ${({ theme }) => theme.background};
  position: relative;
  overflow: hidden;
  margin-bottom: 0.5rem;

  .dateData {
    background: ${({ theme }) => theme.background};
    border-bottom: 2px solid ${({ theme }) => theme.border};
    padding: 0.5rem;

    p {
      flex: 1;
      font-size: 1.1rem;

      &.textLight {
        color: ${({ theme }) => theme.textLight};
      }
    }
  }

  .editBtn {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 5px;
    padding: 0.25rem 0.5rem;
    border: none;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.text};
  }

  .bottomBtn {
    border-radius: 5px;
    padding: 0.75rem;
    margin: 0 0.5rem;
    border: none;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.text};
  }
`;

const WorkoutOptions = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  border-radius: 5px;
  background: ${({ theme }) => theme.buttonLight};

  h3 {
    margin-left: 0.5rem;
  }

  ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    &:first-of-type {
      margin-bottom: 0.5rem;
    }

    li {
      background: ${({ theme }) => theme.background};
      margin: 0.25rem;
      padding: 0.5rem;
      border-radius: 5px;
      min-width: max-content;

      &.highlight {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};
      }
      &.disable {
        background: ${({ theme }) => theme.buttonMed};
        color: ${({ theme }) => theme.textLight};
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
  }
`;
