import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
// API
import { getRoutineFromId } from "../../utils/api";
import { formatIsoDate } from "../../utils/dateAndTime";
import LoadingSpinner from "../LoadingSpinner";
// Components
import Calendar from "./Calendar";

export default function RoutineEditor({ routine_id, setShowRoutineEditor, setTeam }) {
  const shadow = useRef(null);

  const [routine, setRoutine] = useState(null);

  const handleRoutineNameChange = ({ target }) =>
    setRoutine((prev) => ({ ...prev, name: target.value }));

  const handleShadowClick = ({ target }) => {
    if (target.classList.contains("shadow")) setShowRoutineEditor(false);
  };

  useEffect(() => {
    const getRoutineData = async () => {
      const routineData = await getRoutineFromId(routine_id);
      setRoutine(routineData);
    };

    if (!routine) getRoutineData();
  }, [routine]);

  return (
    <Shadow ref={shadow} className="shadow" onClick={handleShadowClick}>
      {routine ? (
        <Editor>
          <button className="closeBtn">X</button>

          <input
            type="text"
            name="routineName"
            className="name"
            value={routine.name}
            onChange={handleRoutineNameChange}
          />

          <div className="dates">
            <div>
              <p>Starts</p>
              <p className="date">{formatIsoDate(routine.workoutPlan[0].isoDate)}</p>
            </div>

            <div>
              <p>Ends</p>
              <p className="date">
                {formatIsoDate(routine.workoutPlan[routine.workoutPlan.length - 1].isoDate)}
              </p>
            </div>
          </div>

          <h3 className="title">Schedule</h3>

          <Calendar data={routine.workoutPlan} />

          {/* {routine.workoutPlan.map(({ workout, isoDate }) => (
            <div key={isoDate}>
              <p>
                {workout.name} - {formatIsoDate(isoDate)}
              </p>
            </div>
          ))} */}
          <button className="saveBtn">Save</button>
        </Editor>
      ) : (
        <div className="loadingContainer">
          <LoadingSpinner />
        </div>
      )}
    </Shadow>
  );
}

const Shadow = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.opacityBackground};
  z-index: 99;
`;

const Editor = styled.div`
  margin: 10vh auto 0;
  padding: 1.5rem 1rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.background};
  max-width: 400px;
  width: 95%;
  position: relative;

  input {
    width: 100%;
    border-radius: 5px;
    border: none;
    background: ${({ theme }) => theme.buttonLight};
    color: ${({ theme }) => theme.text};
    margin: 0.5rem 0;
    padding: 0.5rem 0 0.5rem 0.5rem;
    font-size: 1.2rem;
  }

  .name {
    text-align: center;
  }

  .dates {
    display: flex;
    justify-content: space-around;

    div {
      background: ${({ theme }) => theme.buttonMed};
      color: ${({ theme }) => theme.textLight};
      border-radius: 5px;
      padding: 0.5rem;

      .date {
        font-size: 1.1rem;
        margin-top: 0.5rem;
      }
    }
  }

  .closeBtn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
    border: none;
    border-radius: 3px;
    height: 15px;
    width: 15px;
    font-size: 10px;
  }

  .title {
    margin-top: 1rem;
  }

  .saveBtn {
    border-radius: 5px;
    padding: 0.75rem;
    border: none;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.text};
  }
`;
