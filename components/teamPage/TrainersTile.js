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

export default function TrainersTile({ team, setTeam, teamMembers, setTeamMembers }) {
  const { user } = useStoreState();

  const [showTrainerManager, setShowTrainerManager] = useState(false);

  const handleRemoveTrainer = async (trainer) => {
    const removed = await removeTrainerFromTeam(team._id, trainer._id);
    if (removed)
      setTeam((prev) => ({
        ...prev,
        trainers: prev.trainers.filter((item) => item._id !== trainer._id),
      }));
  };

  const handleAddTrainer = async (trainer) => {
    const added = await addTrainerToTeam(team._id, trainer._id);
    if (added) setTeam((prev) => ({ ...prev, trainers: [...prev.trainers, trainer] }));
  };

  useEffect(() => {
    const getTeamMembers = async () => {
      const members = await getUsersFromIdArr(team.members);
      setTeamMembers(members);
    };

    if (showTrainerManager && !teamMembers) getTeamMembers();
  }, [showTrainerManager]);

  return (
    <Tile>
      <h3 className="title">Trainers</h3>

      <TrainerList>
        {team.trainers.map((trainer) => (
          <Link href={`/users/${trainer.username}`} key={trainer._id}>
            <li>
              <div className="icon">
                <Image src="/favicon.jpeg" height="40" width="40"></Image>
              </div>
              <p>{trainer.username}</p>

              {trainer.isTrainer && (
                <div className="verified">
                  <span>Verified</span>
                  <Checkmark styles={{ transform: "scale(.5)" }} />
                </div>
              )}
            </li>
          </Link>
        ))}

        {user._id === team.creator_id && (
          <li onClick={() => setShowTrainerManager(true)} key={"addTrainer"}>
            <div className="icon">
              <span></span>
              <span></span>
            </div>
            <p>Add</p>
          </li>
        )}
      </TrainerList>

      {showTrainerManager && (
        <Modal removeModal={() => setShowTrainerManager(false)} isOpen={showTrainerManager}>
          <TrainerManager>
            <h3 className="title">Members</h3>

            {teamMembers ? (
              <ul>
                {teamMembers.map((member) => (
                  <li key={member._id}>
                    <p>{member.username}</p>

                    {team.trainers.findIndex((trainer) => trainer._id === member._id) >= 0 ? (
                      <button className="remove" onClick={() => handleRemoveTrainer(member)}>
                        remove
                      </button>
                    ) : (
                      <button className="add" onClick={() => handleAddTrainer(member)}>
                        add
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <LoadingSpinner />
            )}
          </TrainerManager>
        </Modal>
      )}
    </Tile>
  );
}

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
    margin: 0 0.5rem;
    background: ${({ theme }) => theme.buttonMed};
    display: grid;
    place-items: center;
    padding: 0.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

    .icon {
      background: ${({ theme }) => theme.buttonLight};
      height: 40px;
      width: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 0.35rem;
      position: relative;

      span {
        position: absolute;
        bottom: 0px;
        right: 0;
        left: 0;
        top: 0;
        margin: auto;
        display: block;
        height: 3px;
        width: 20px;
        background: ${({ theme }) => theme.textLight};
        border-radius: 7px;

        &:first-of-type {
          transform: rotate(90deg);
        }
      }
    }

    .verified {
      display: flex;
      justify-content: center;
      align-items: center;
      background: ${({ theme }) => theme.background};
      border-radius: 5px;
      margin-top: 0.25rem;
      height: 20px;
      width: fit-content;

      span {
        margin-left: 0.5rem;
        font-size: 0.6rem;
        color: ${({ theme }) => theme.accentSoft};
        font-weight: 600;
        letter-spacing: 0px;
      }
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

const TrainerManager = styled.div`
  margin: 1rem auto 0;
  padding: 0.5rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.background};
  max-width: 400px;
  width: 95%;
  position: relative;

  ul {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 5px;
      background: ${({ theme }) => theme.buttonMed};

      button {
        min-width: max-content;
        cursor: pointer;
        border-radius: 5px;
        border: none;
        padding: 0.25rem;
        box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};

        &.add {
          background: ${({ theme }) => theme.accentSoft};
          color: ${({ theme }) => theme.accentText};
        }

        &.remove {
          background: ${({ theme }) => theme.buttonLight};
          color: ${({ theme }) => theme.textLight};
        }
      }
    }
  }
`;
