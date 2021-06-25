import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
// API
import { getTeamById } from "../../utils/api";
// Components
import LoadingSpinner from "../../components/LoadingSpinner";
import TopTile from "../../components/teamPage/TopTile";
import TrainersTile from "../../components/teamPage/TrainersTile";
import RoutineTile from "../../components/teamPage/RoutineTile";
// Context
import { useStoreState } from "../../store";

export default function Team_id() {
  const router = useRouter();
  const { team_id } = router.query;

  const { user } = useStoreState();

  const [team, setTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState(null);

  useEffect(() => {
    const getTeamData = async () => {
      const teamData = await getTeamById(team_id);
      setTeam(teamData);
    };

    if (user && team_id && !team) getTeamData();
  }, [team_id, user]);

  return (
    <Container>
      {team ? (
        <>
          <TopTile
            team={team}
            setTeam={setTeam}
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
          />

          <TrainersTile
            team={team}
            setTeam={setTeam}
            user_id={user._id}
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
          />

          <RoutineTile team={team} setTeam={setTeam} />
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

  .title {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 300;
  }

  .loadingContainer {
    height: 100vh;
    display: grid;
    place-items: center;
  }
`;
