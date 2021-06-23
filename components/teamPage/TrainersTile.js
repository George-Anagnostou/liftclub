import React from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
// Components
import Checkmark from "../Checkmark";

export default function TrainersTile({ team, user_id }) {
  const handleAddTrainer = async () => {
    console.log("add trainer");
  };

  return (
    <Tile>
      <h3>Trainers</h3>

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
                  <Checkmark position={{ transform: "scale(.5)" }} />
                </div>
              )}
            </li>
          </Link>
        ))}

        {user_id === team.creator_id && (
          <li onClick={handleAddTrainer} key={"addTrainer"}>
            <div className="icon">
              <span></span>
              <span></span>
            </div>
            <p>Add</p>
          </li>
        )}
      </TrainerList>
    </Tile>
  );
}

const Tile = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 1rem 0.5rem;
  border-radius: 10px;

  h3 {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 300;
  }
`;

const TrainerList = styled.ul`
  width: 100%;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;

  li {
    margin: 0 0.5rem;
    background: ${({ theme }) => theme.buttonMed};
    display: grid;
    place-items: center;
    padding: 0.5rem;
    border-radius: 10px;

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
`;
