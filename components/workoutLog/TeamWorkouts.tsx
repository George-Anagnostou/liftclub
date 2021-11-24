import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUserState } from "../../store";
// API
import { getTeamsFromIdArray, getWorkoutFromId } from "../../api-lib/fetchers";
// Interfaces
import { Team, Workout } from "../../types/interfaces";
// Utils
import { areTheSameDate } from "../../utils";

interface Props {
  selectedDate: string;
  displayPremadeWorkout: (clicked: Workout) => Promise<void>;
}

const TeamWorkouts: React.FC<Props> = ({ selectedDate, displayPremadeWorkout }) => {
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
            const day = plan.find((day) => areTheSameDate(day.isoDate, selectedDate));
            if (day) workout = await getWorkoutFromId(day?.workout_id);
          }
          return { teamName: team.teamName, workout: workout || null };
        })
      );
      setTodaysWorkouts(data);
    };

    // Only get workouts for today when user has joined a team and there is no workout logged for selected date
    if (teamsJoined && !user?.workoutLog[selectedDate]) getTodaysWorkouts();
  }, [teamsJoined, selectedDate, user?.workoutLog]);

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
          <h3 className="section-title">Joined Teams</h3>

          <ul>
            {todaysWorkouts?.map(({ teamName, workout }) => (
              <JoinedTeam
                key={teamName}
                onClick={workout ? () => displayPremadeWorkout(workout) : () => {}}
                className={workout ? "has-workout" : ""}
              >
                <p className="team-name">{teamName}</p>

                <hr />

                {workout?.name ? (
                  <p className="workout-name">
                    ◦ Today's workout is <span>{workout.name}</span>
                  </p>
                ) : (
                  <p className="workout-name">
                    ◦ Today is a rest day <span />
                  </p>
                )}
              </JoinedTeam>
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
`;

const JoinedTeam = styled.li`
  background: ${({ theme }) => theme.buttonMedGradient};
  margin: 0 0.25rem 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  color: ${({ theme }) => theme.textLight};
  transition: all 0.25s ease;

  .team-name {
    font-size: 1rem;
    font-weight: 300;
  }

  hr {
    margin: 0.25rem 0 0.5rem;
    padding: 0;
    border: none;
    border-top: medium double ${({ theme }) => theme.buttonLight};
  }

  .workout-name {
    font-size: 0.8rem;
    font-weight: 200;
    letter-spacing: 1px;
    padding: 0 0.5rem;
    word-wrap: break-word;

    span {
      opacity: 0;
      transition: opacity 0.25s ease-in-out;
      padding: 0.15rem 0.5rem;
      font-weight: 400;
      font-size: 1rem;
    }
  }

  &.has-workout {
    box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow},
      inset 0 0 3px ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.text};

    .workout-name span {
      opacity: 1;
      background: ${({ theme }) => theme.buttonLight};
      border-radius: 5px;
      box-shadow: inset 0 0 2px ${({ theme }) => theme.boxShadow};
    }
  }
`;
