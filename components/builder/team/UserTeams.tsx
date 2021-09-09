import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Context
import { useStoreState } from "../../../store";
// Api
import { getTeamById, getUserMadeTeams } from "../../../utils/api";
// Interfaces
import { Team } from "../../../utils/interfaces";
import { EditableTeam } from "./index";

interface Props {
  team: EditableTeam;
  setTeam: React.Dispatch<React.SetStateAction<EditableTeam>>;
}

const UserTeams: React.FC<Props> = ({ team, setTeam }) => {
  const { user } = useStoreState();

  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<{ _id: string }>({ _id: "" });

  const handleTeamClick = async (team: Team) => {
    setLoading({ _id: team._id });

    const teamData = await getTeamById(team._id);
    console.log(teamData);
    if (teamData) setTeam(teamData);

    setLoading({ _id: "" });
  };

  useEffect(() => {
    const getUserTeams = async () => {
      const teams = await getUserMadeTeams(user!._id);
      console.log(teams);
      if (teams) setUserTeams(teams);
    };
    if (user) getUserTeams();
  }, [user]);

  return (
    <Container className="tile">
      <h3>Your Teams</h3>

      {Boolean(userTeams.length) ? (
        <ul>
          {userTeams.map((userTeam) => (
            <li
              key={userTeam._id}
              onClick={() => handleTeamClick(userTeam)}
              className={`${team._id === userTeam._id && "highlight"} ${
                loading._id === userTeam._id && "loading"
              }`}
            >
              {userTeam.teamName}
            </li>
          ))}
        </ul>
      ) : (
        <p className="fallbackText">None</p>
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
      padding: 0.5rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;

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
          0.25turn,
          ${({ theme }) => theme.buttonMed},
          ${({ theme }) => theme.border}
        );
        color: ${({ theme }) => theme.text};
        background-repeat: no-repeat;
        background-size: 200% 100%;
        background-position: -100%;

        animation: loading 1s infinite;

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
