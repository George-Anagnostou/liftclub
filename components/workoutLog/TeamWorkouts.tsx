import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUserState } from "../../store";
// API
import { getTeamsFromIdArray, getWorkoutFromId } from "../../utils/api";
// Interfaces
import { Team, Workout } from "../../types/interfaces";

interface Props {
  selectedDate: string;
  displayWorkout: (clicked: Workout) => Promise<void>;
}

const TeamWorkouts: React.FC<Props> = ({ selectedDate, displayWorkout }) => {
  const { user } = useUserState();

  const [teamsJoined, setTeamsJoined] = useState<Team[] | null>(null);
  const [todaysWorkouts, setTodaysWorkouts] = useState<
    { teamName: Team["teamName"]; workout: Workout | null }[] | null
  >(null);

  useEffect(() => {
    const getTodaysWorkouts = async () => {
      const data = await Promise.all(
        teamsJoined!.map(async (team) => {
          const plan = team.routine?.workoutPlan;

          let workout: Workout | false = false;

          if (plan) {
            const day = plan.find((day) => day.isoDate.substring(0, 10) === selectedDate);
            if (day) workout = await getWorkoutFromId(day?.workout_id);
          }
          return { teamName: team.teamName, workout: workout || null };
        })
      );
      setTodaysWorkouts(data);
    };

    if (teamsJoined) getTodaysWorkouts();
  }, [teamsJoined, selectedDate]);

  useEffect(() => {
    // If user is in a team, get its routine workout
    if (user && user.teamsJoined) {
      const loadTeamRoutines = async () => {
        const teams = await getTeamsFromIdArray(user.teamsJoined!);
        if (teams.length) setTeamsJoined(teams);
      };

      loadTeamRoutines();
    }
  }, [user]);

  return (
    <>
      {teamsJoined && (
        <WorkoutsList>
          <h3>Joined Teams</h3>

          <ul>
            {todaysWorkouts?.map(({ teamName, workout }) => (
              <li key={teamName} onClick={workout ? () => displayWorkout(workout) : () => {}}>
                <p className="team-name">{teamName}</p>

                <p className="workout">{workout?.name || "No workout today"}</p>
              </li>
            ))}
          </ul>
        </WorkoutsList>
      )}
    </>
  );
};

export default TeamWorkouts;

const WorkoutsList = styled.div`
  width: 100%;
  border-radius: 5px;
  background: ${({ theme }) => theme.background};
  margin-bottom: 0.5rem;

  h3 {
    text-align: left;
    padding-left: 0.75rem;
    margin: 0.25rem 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
  }

  ul {
    li {
      width: fit-content;
      display: flex;
      align-items: center;
      background: ${({ theme }) => theme.buttonMed};
      margin: 0 0.25rem 0.5rem;
      padding: 0.2rem 0.2rem 0.2rem 0.5rem;
      border-radius: 5px;
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      cursor: pointer;
      font-weight: 300;
    }

    .team-name {
    }

    .workout {
      font-weight: 300;
      background: ${({ theme }) => theme.buttonLight};
      border-radius: 5px;
      padding: 0.15rem 1rem;
      margin: 0 0 0 0.75rem;
      word-wrap: break-word;
      text-align: left;
    }
  }
`;
