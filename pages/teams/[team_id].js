import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
// API
import { getTeamById } from "../../utils/api";
// Utils
import { timeBetween } from "../../utils";
// Components
import LoadingSpinner from "../../components/LoadingSpinner";
import TopTile from "../../components/teamPage/TopTile";
import TrainersTile from "../../components/teamPage/TrainersTile";
// Context
import { useStoreState } from "../../store";

export default function Team_id() {
  const router = useRouter();
  const { team_id } = router.query;

  const { user } = useStoreState();

  const [team, setTeam] = useState(null);

  const formatWorkoutPlan = (plan) => {
    const days = timeBetween(new Date(plan[0].isoDate), new Date(plan[plan.length - 1].isoDate));

    return (
      <div>
        <p>{days}</p>
        <p>{plan.length} workouts</p>
      </div>
    );
  };

  useEffect(() => {
    const getTeamData = async () => {
      const teamData = await getTeamById(team_id);

      console.log(teamData);
      setTeam(teamData);
    };

    if (user && team_id && !team) getTeamData();
  }, [team_id, user]);

  return (
    <Container>
      {team ? (
        <>
          <TopTile team={team} setTeam={setTeam} />

          <TrainersTile team={team} user_id={user._id} />

          <h3>Workout Plan</h3>

          <p>{team.routineName}</p>

          {formatWorkoutPlan(team.routine.workoutPlan)}
        </>
      ) : (
        <div className="loadingContainer">
          <LoadingSpinner />
        </div>
      )}
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;

  & > * {
    margin-bottom: 0.5rem;
  }

  .loadingContainer {
    height: 100vh;
    display: grid;
    place-items: center;
  }
`;
