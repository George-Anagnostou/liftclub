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
// Interfaces
import { User, Team } from "../../utils/interfaces";

const Team_id: React.FC = () => {
  const router = useRouter();
  const { team_id } = router.query;

  const { user } = useStoreState();

  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[] | null>(null);

  useEffect(() => {
    const getTeamData = async () => {
      const teamData = await getTeamById(String(team_id));
      if (teamData) setTeam(teamData);
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
};
export default Team_id;

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
    font-size: 1rem;
  }

  .loadingContainer {
    height: 100vh;
    display: grid;
    place-items: center;
  }
`;
