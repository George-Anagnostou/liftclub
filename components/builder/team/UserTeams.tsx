import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
// Context
import { useBuilderDispatch, useBuilderState, useUserState } from "../../../store";
// API
import { getTeamById } from "../../../utils/api";
// Interfaces
import { Team } from "../../../utils/interfaces";
import { EditableTeam } from "./index";
// Components
import DeleteTeamModal from "./DeleteTeamModal";
import { getUserCreatedTeams } from "../../../store/actions/builderActions";

interface Props {
  team: EditableTeam;
  setTeam: React.Dispatch<React.SetStateAction<EditableTeam>>;
  clearTeam: () => void;
}

const UserTeams: React.FC<Props> = ({ team, setTeam, clearTeam }) => {
  const { user } = useUserState();
  const { teams } = useBuilderState();
  const builderDispatch = useBuilderDispatch();
  
  const router = useRouter();

  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [loading, setLoading] = useState<string>("");
  const [hasQueriedUrl, setHasQueriedUrl] = useState(false);

  const handleTeamClick = async (team: Team) => {
    setLoading(team._id);

    const teamData = await getTeamById(team._id);
    if (teamData) setTeam(teamData);

    setLoading("");
  };

  useEffect(() => {
    if (user && !teams.created) getUserCreatedTeams(builderDispatch, user._id);
  }, [user]);

  // If url has query for specific team, set that team
  useEffect(() => {
    const queriedTeam_id = router.query.team as string;

    if (queriedTeam_id && teams.created && !hasQueriedUrl) {
      const queried = teams.created.find((each) => each._id === queriedTeam_id);

      if (queried) handleTeamClick(queried);
      setHasQueriedUrl(true);
    }
  }, [teams.created]);

  return (
    <Container className="tile">
      <h3>Your Teams</h3>

      {teams.created ? (
        <ul>
          {teams.created.map((userTeam) => (
            <li
              key={userTeam._id}
              onClick={() => handleTeamClick(userTeam)}
              className={`${team._id === userTeam._id && "highlight"} ${
                loading === userTeam._id && "loading"
              }`}
            >
              {userTeam.teamName}

              <button onClick={() => setTeamToDelete(userTeam)}>X</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="fallbackText">None</p>
      )}

      {teamToDelete && (
        <DeleteTeamModal
          team={teamToDelete}
          setTeamToDelete={setTeamToDelete}
          clearTeam={clearTeam}
        />
      )}
    </Container>
  );
};
export default UserTeams;

const Container = styled.div`
  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      font-weight: 300;

      button {
        font-size: 0.7rem;
        font-weight: 600;
        background: ${({ theme }) => theme.buttonLight};
        color: ${({ theme }) => theme.textLight};
        border: none;
        border-radius: 3px;
        margin-left: 0.3rem;
        height: 20px;
        width: 20px;
        padding: 0;
        transition: all 0.25s ease;
      }

      &.highlight {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};

        button {
          background: ${({ theme }) => theme.accent};
          color: ${({ theme }) => theme.accentText};
        }
      }

      &.loading {
        background: linear-gradient(
          to left,
          ${({ theme }) => theme.buttonMed},
          ${({ theme }) => theme.border}
        );
        color: ${({ theme }) => theme.text};
        background-position: -100%;
        background-size: 200% 100%;

        animation: ease-in loading 1s infinite;

        @keyframes loading {
          to {
            background-position: 100%;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
`;
