import React from "react";
import styled from "styled-components";
import Link from "next/link";
// Utils
import { timeSince } from "../../utils";
// Interfaces
import { Workout } from "../../types/interfaces";

interface Props {
  createdWorkouts: Workout[];
}

const CreatedWorkoutsTile: React.FC<Props> = ({ createdWorkouts }) => {
  return (
    <Container>
      <div className="topbar">
        <h3 className="title">Workouts Created</h3>

        <Link href="/builder?builder=workout">
          <button>+</button>
        </Link>
      </div>

      <WorkoutsList>
        {Boolean(createdWorkouts.length) ? (
          createdWorkouts.map((workout: Workout) => (
            <li key={workout._id}>
              <p>{workout.name}</p>
              <span>{timeSince(new Date(workout.date_created).getTime())}</span>
            </li>
          ))
        ) : (
          <p className="noWorkouts">None</p>
        )}
      </WorkoutsList>
    </Container>
  );
};

export default CreatedWorkoutsTile;

const Container = styled.section`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 0.5rem;
  border-radius: 10px;
  text-align: left;

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      min-width: max-content;
      border-radius: 5px;
      padding: 0rem 0.4rem;
      margin-bottom: 0.5rem;
      border: ${({ theme }) => theme.border};
      color: ${({ theme }) => theme.textLight};
      background: ${({ theme }) => theme.buttonMed};
      font-size: 1rem;
    }
  }
`;

const WorkoutsList = styled.ul`
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.25rem 0;
    padding: 0.25rem 0.5rem;

    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.buttonMed};
    }

    p {
      text-transform: capitalize;
      font-size: 0.9rem;
      font-weight: 200;
    }

    span {
      min-width: max-content;
      font-size: 0.7rem;
      color: ${({ theme }) => theme.textLight};
    }
  }

  .noWorkouts {
    line-height: 1.2rem;
    font-size: 0.9rem;
    padding: 0.25rem;
    font-weight: 200;
  }
`;
