import React from "react";
import Link from "next/link";
import styled from "styled-components";
// Interfaces
import { Team } from "../../utils/interfaces";
// Context
import { useStoreState } from "../../store";

interface Props {
  profileTeamsJoined: Team[];
  profile_id: string;
}

const TeamsTile: React.FC<Props> = ({ profileTeamsJoined, profile_id }) => {
  const { user } = useStoreState();

  return (
    <Container>
      <div className="topbar">
        <h3 className="title">Teams Joined</h3>

        <Link href="/builder?builder=team">
          <button>+</button>
        </Link>
      </div>

      <TeamsList>
        {Boolean(profileTeamsJoined.length) ? (
          profileTeamsJoined.map((team) => (
            <TeamItem key={team._id}>
              <Link href={`/teams/${team._id}`}>
                <div className="team-info">
                  <p className="team-name">
                    {(() => {
                      if (team.creator_id === profile_id) return "Leader of ";
                      else if (team.trainers.some((trainer) => String(trainer) === profile_id))
                        return "Trainer of ";
                      else return "Member of ";
                    })()}

                    <span>{team.teamName}</span>
                  </p>
                  <p className="members">
                    {team.members.length} {team.members.length === 1 ? "member" : "members"}
                  </p>
                </div>
              </Link>
            </TeamItem>
          ))
        ) : (
          <p className="no-teams">None</p>
        )}
      </TeamsList>
    </Container>
  );
};
export default TeamsTile;

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

const TeamsList = styled.ul`
  .no-teams {
    line-height: 1.2rem;
    font-size: 0.9rem;
    padding: 0.25rem;
    font-weight: 200;
  }
`;

const TeamItem = styled.li`
  padding: 0.25rem 0.5rem;
  width: 100%;

  .team-info {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .team-name {
      font-size: 0.8rem;
      font-weight: 200;
      span {
        font-weight: 300;
        font-size: 0.95rem;
      }
    }

    .members {
      color: ${({ theme }) => theme.textLight};
      font-size: 0.6rem;
    }
  }
`;
