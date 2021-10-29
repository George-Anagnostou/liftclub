import React, { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";
import update from "immutability-helper";
// Interfaces
import { EditableTeam } from "./index";
import { Team } from "../../../utils/interfaces";
// Components
import Magnifying from "../../svg/Magnifying";
// API
import { queryUsersByUsername } from "../../../utils/api";
// Hooks
import { useDebouncedState } from "../../hooks/useDebouncedState";

interface Props {
  team: EditableTeam;
  setTeam: React.Dispatch<React.SetStateAction<EditableTeam>>;
}

const TrainersTile: React.FC<Props> = ({ team, setTeam }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Team["trainers"] | null>(null);

  const debouncedInput = useDebouncedState(searchInput, 200);

  const addTrainer = (trainer: {
    _id: string;
    username: string;
    profileImgUrl: string | undefined;
  }) => {
    setTeam(update(team, { trainers: { $push: [trainer] } }));
  };

  const removeTrainer = (index: number) => {
    setTeam(update(team, { trainers: { $splice: [[index, 1]] } }));
  };

  useEffect(() => {
    const search = async () => {
      const users = await queryUsersByUsername(debouncedInput);
      if (users && debouncedInput) setSearchResults(users);
    };

    debouncedInput ? search() : setSearchResults(null);
  }, [debouncedInput]);

  return (
    <Container className="tile">
      <h3>Trainers</h3>

      <Trainers>
        {team.trainers.length ? (
          team.trainers.map((trainer, i) => (
            <li key={trainer._id} className="trainer">
              {trainer.profileImgUrl ? (
                <img src={trainer.profileImgUrl} alt={trainer.username} />
              ) : (
                <Image src="/favicon.png" height="30" width="30"></Image>
              )}

              <p className="username">{trainer.username}</p>

              <button onClick={() => removeTrainer(i)}>X</button>
            </li>
          ))
        ) : (
          <p className="fallback-text">None</p>
        )}
      </Trainers>

      <SearchContainer>
        <SearchBar>
          <span className="icon">
            <Magnifying />
          </span>

          <div className="input">
            <input
              type="text"
              name="add-trainer"
              placeholder="Add trainer"
              value={searchInput}
              autoComplete="off"
              onChange={(e) =>
                setSearchInput(
                  e.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
                )
              }
            />

            <span className="clear" onClick={() => setSearchInput("")}>
              <span></span>
              <span></span>
            </span>
          </div>
        </SearchBar>

        {searchResults && searchInput && (
          <SearchResults>
            {Boolean(searchResults.length) ? (
              searchResults.map((trainer) => (
                <li className="result" key={trainer._id}>
                  {trainer.profileImgUrl ? (
                    <img src={trainer.profileImgUrl} alt={trainer.username} />
                  ) : (
                    <Image src="/favicon.png" height="30" width="30"></Image>
                  )}

                  <p>{trainer.username}</p>

                  {(() => {
                    const indexOfTrainer = team.trainers.findIndex((t) => t._id === trainer._id);

                    return indexOfTrainer === -1 ? (
                      <button onClick={() => addTrainer(trainer)} className="add">
                        add
                      </button>
                    ) : (
                      <button onClick={() => removeTrainer(indexOfTrainer)}>remove</button>
                    );
                  })()}
                </li>
              ))
            ) : (
              <li className="result">
                <p>No matches</p>
              </li>
            )}
          </SearchResults>
        )}
      </SearchContainer>
    </Container>
  );
};

export default TrainersTile;

const Container = styled.div`
  padding-bottom: 0.25rem;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0.25rem;
  background: inherit;
  padding: 0.25rem 0.25rem;
  border-radius: 5px;
  position: relative;
`;

const SearchResults = styled.ul`
  background: ${({ theme }) => theme.buttonMed};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 5px 10px ${({ theme }) => theme.boxShadow};
  z-index: 99;
  border-radius: 5px;
  margin: 0.25rem 1.75rem 0 2rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  max-height: 24rem;
  overflow-y: scroll;

  .result {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    font-size: 1rem;

    img {
      height: 20px;
      width: 20px;
      border-radius: 50%;
    }

    p {
      margin-left: 0.5rem;
      text-align: left;
      flex: 1;
    }

    button {
      font-size: 0.6rem;
      font-weight: 300;
      background: ${({ theme }) => theme.buttonLight};
      color: ${({ theme }) => theme.textLight};
      border: none;
      border-radius: 3px;
      margin-left: 0.3rem;
      padding: 0.1rem 0.25rem;

      &.add {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};
      }
    }
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;

  .icon {
    display: grid;
    place-items: center;
    margin: 0 0.5rem 0 0.25rem;
    svg {
      fill: ${({ theme }) => theme.textLight};
      height: 20px;
      width: 20px;
    }
  }

  .input {
    flex: 1;
    border-radius: 5px;
    display: flex;
    align-items: center;
    height: 2.25rem;

    input {
      appearance: none;
      background: ${({ theme }) => theme.buttonLight};
      color: ${({ theme }) => theme.text};
      border: 1px solid ${({ theme }) => theme.buttonLight};
      padding: 0.25rem 0.5rem;
      width: 100%;
      margin: 0;
      font-size: 1rem;
      border-radius: 5px;

      &:focus {
        outline: none;
        border: 1px solid ${({ theme }) => theme.accentSoft};
      }
    }

    .clear {
      width: 2rem;
      height: 2.25rem;
      position: relative;

      span {
        position: absolute;
        display: block;
        height: 2px;
        width: 15px;
        background: ${({ theme }) => theme.textLight};
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 3px;

        &:first-child {
          transform: rotate(45deg);
        }
        &:last-child {
          transform: rotate(-45deg);
        }
      }
    }
  }
`;

const Trainers = styled.div`
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .trainer {
    margin: 0.25rem;
    padding: 0.25rem 0.5rem;
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.buttonMed};
    border-radius: 5px;
    width: fit-content;
    box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};

    img {
      height: 30px;
      width: 30px;
      border-radius: 50%;
    }

    .username {
      margin: 0 0.5rem;
      font-weight: 300;
    }

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
  }
`;
