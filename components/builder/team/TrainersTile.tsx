import React from "react";
import Image from "next/image";
import styled from "styled-components";
import update from "immutability-helper";
// Interfaces
import { EditableTeam } from "./index";
import { User } from "../../../utils/interfaces";

interface Props {
  team: EditableTeam;
  setTeam: React.Dispatch<React.SetStateAction<EditableTeam>>;
}

const TrainersTile: React.FC<Props> = ({ team, setTeam }) => {
  const addTrainer = (trainer: User) => {
    setTeam(update(team, { trainers: { $push: [trainer] } }));
  };

  return (
    <Container className="tile">
      <h3>Trainers</h3>

      <ul>
        {team.trainers.map((trainer) => (
          <li key={trainer._id}>
            {trainer.profileImgUrl ? (
              <img src={trainer.profileImgUrl} alt={trainer.username} />
            ) : (
              <Image src="/favicon.png" height="45" width="45"></Image>
            )}

            <p className="username">{trainer.username}</p>
          </li>
        ))}
      </ul>

      <button className="add">Add Trainer</button>
    </Container>
  );
};

export default TrainersTile;

const Container = styled.div`
  ul {
    li {
      padding: 0.5rem;
      display: flex;
      align-items: center;

      img {
        height: 45px;
        width: 45px;
        border-radius: 50%;
      }

      .username {
        margin-left: 0.5rem;
        font-size: 1.15rem;
        font-weight: 300;
      }
    }
  }

  .add {
    background: ${({ theme }) => theme.buttonLight};
    color: ${({ theme }) => theme.textLight};
    padding: 0.5rem 1rem;
    margin-bottom: .5rem;
    border-radius: 5px;
    border: none;
    box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
  }
`;
