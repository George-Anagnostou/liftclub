import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
// Components
import Checkmark from "../Checkmark";
import LoadingSpinner from "../LoadingSpinner";
import Modal from "../Wrappers/Modal";
// Utils
import { addTrainerToTeam, getUsersFromIdArr, removeTrainerFromTeam } from "../../utils/api";
// Context
import { useStoreState } from "../../store";
// Interfaces
import { Team, User } from "../../utils/interfaces";
import TrainerModal from "./TrainerModal";

interface Props {
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team | null>>;
  teamMembers: User[] | null;
  setTeamMembers: React.Dispatch<React.SetStateAction<User[] | null>>;
}

const TrainersTile: React.FC<Props> = ({ team, setTeam, teamMembers, setTeamMembers }) => {
  const { user } = useStoreState();

  const [showTrainerModal, setShowTrainerModal] = useState(false);

  const handleRemoveTrainer = async (trainer: User) => {
    const removed = await removeTrainerFromTeam(team._id, trainer._id);
    if (removed)
      setTeam(
        (prev) =>
          prev && {
            ...prev,
            trainers: prev.trainers.filter((item) => item._id !== trainer._id),
          }
      );
  };

  const handleAddTrainer = async (trainer: User) => {
    const added = await addTrainerToTeam(team._id, trainer._id);
    if (added) setTeam((prev) => prev && { ...prev, trainers: [...prev.trainers, trainer] });
  };

  useEffect(() => {
    const getTeamMembers = async () => {
      const members = await getUsersFromIdArr(team.members);
      setTeamMembers(members || []);
    };

    if (showTrainerModal && !teamMembers) getTeamMembers();
  }, [showTrainerModal]);

  return (
    <Tile>
      <h3 className="title">Trainers</h3>

      <TrainerList>
        {team.trainers.map((trainer) => (
          <Link href={`/users/${trainer.username}`} key={trainer._id}>
            <li>
              <div className="icon">
                <img src={trainer.profileImgUrl || "/favicon.png"} />
              </div>

              <p>{trainer.username}</p>

              {/* {trainer.isTrainer && (
                <div className="verified">
                  <Checkmark styles={{ transform: "scale(.5)" }} />
                </div>
              )} */}
            </li>
          </Link>
        ))}

        {user!._id === team.creator_id && (
          <li onClick={() => setShowTrainerModal(true)} key={"addTrainer"}>
            <div className="icon">
              <span></span>
              <span></span>
            </div>
            <p>Add</p>
          </li>
        )}
      </TrainerList>

      {showTrainerModal && (
        <TrainerModal
          setShowTrainerModal={setShowTrainerModal}
          showTrainerModal={showTrainerModal}
          teamMembers={teamMembers}
          team={team}
          handleRemoveTrainer={handleRemoveTrainer}
          handleAddTrainer={handleAddTrainer}
        />
      )}
    </Tile>
  );
};
export default TrainersTile;

const Tile = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 1rem 0.5rem;
  border-radius: 10px;
`;

const TrainerList = styled.ul`
  width: 100%;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 4px 0;

  li {
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 0 0.5rem;
    background: ${({ theme }) => theme.buttonMed};

    padding: 0.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

    .icon {
      background: ${({ theme }) => theme.buttonLight};
      box-shadow: 0 0 3px ${({ theme }) => theme.boxShadow};
      height: 25px;
      width: 25px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;

      img {
        height: 25px;
        width: 25px;
        object-fit: cover;
      }

      span {
        position: absolute;
        bottom: 0px;
        right: 0;
        left: 0;
        top: 0;
        margin: auto;
        display: block;
        height: 2px;
        width: 15px;
        background: ${({ theme }) => theme.textLight};
        border-radius: 7px;

        &:first-of-type {
          transform: rotate(90deg);
        }
      }
    }

    p {
      margin-left: 0.25rem;
    }
  }

  @media (max-width: 425px) {
    /* Remove scroll bar on mobile */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
