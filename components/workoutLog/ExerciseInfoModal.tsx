import React from "react";
import styled from "styled-components";
import Image from "next/image";

import { Exercise } from "../../utils/interfaces";
import Modal from "../Wrappers/Modal";

const MuscleIcons = {
  core: <Image src="/muscle-group-icons/abs.jpg" layout="intrinsic" height={100} width={100} />,
  quads: <Image src="/muscle-group-icons/quads.jpg" layout="intrinsic" height={100} width={100} />,
  chest: <Image src="/muscle-group-icons/chest.jpg" layout="intrinsic" height={100} width={100} />,
  calves: (
    <Image src="/muscle-group-icons/calves.jpg" layout="intrinsic" height={100} width={100} />
  ),
  "upper arm": (
    <Image src="/muscle-group-icons/biceps.jpg" layout="intrinsic" height={100} width={100} />
  ),
  shoulder: (
    <Image src="/muscle-group-icons/shoulder.jpg" layout="intrinsic" height={100} width={100} />
  ),
  hamstrings: (
    <Image src="/muscle-group-icons/hamstrings.jpg" layout="intrinsic" height={100} width={100} />
  ),
  "lower back": (
    <Image src="/muscle-group-icons/lower-back.jpg" layout="intrinsic" height={100} width={100} />
  ),
  "upper back": (
    <Image src="/muscle-group-icons/upper-back.jpg" layout="intrinsic" height={100} width={100} />
  ),
};

interface Props {
  exerciseInfo: Exercise;
  setExerciseInfo: React.Dispatch<React.SetStateAction<Exercise | null>>;
}

const ExerciseInfoModal: React.FC<Props> = ({ exerciseInfo, setExerciseInfo }) => {
  return (
    <Modal isOpen={exerciseInfo} removeModal={() => setExerciseInfo(null)}>
      <ExerciseInfo>
        <button className="close-btn" onClick={() => setExerciseInfo(null)}>
          X
        </button>

        <h3>{exerciseInfo.name}</h3>

        {MuscleIcons[exerciseInfo.muscleGroup] && (
          <div className="icon">{MuscleIcons[exerciseInfo.muscleGroup]}</div>
        )}

        <div className="text">
          <span>Muscle: </span>
          <p>{exerciseInfo.muscleWorked}</p>
        </div>

        <div className="text">
          <span>Equipment: </span>
          <p>{exerciseInfo.equipment}</p>
        </div>
      </ExerciseInfo>
    </Modal>
  );
};

export default ExerciseInfoModal;

const ExerciseInfo = styled.div`
  position: relative;
  width: 95%;
  margin: 10vh auto;
  max-width: 350px;
  background: ${({ theme }) => theme.buttonLight};
  box-shadow: 0 0 10px ${({ theme }) => theme.boxShadow};
  border-radius: 5px;
  padding: 1.5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;

  .close-btn {
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
    border: none;
    border-radius: 3px;
    position: absolute;
    top: 2px;
    right: 2px;
    height: 15px;
    width: 15px;
    font-size: 10px;
  }

  h3 {
    font-weight: 400;
    font-size: 1.5rem;
    text-transform: capitalize;
    margin-bottom: 0.5rem;
  }

  .text {
    margin-top: 1rem;
    span {
      font-weight: 300;
      color: ${({ theme }) => theme.textLight};
    }
    p {
      font-size: 1.3rem;
      text-transform: capitalize;
    }
  }

  .icon {
    border-radius: 50%;
    overflow: hidden;
    height: 100px;
    width: 100px;
    margin: auto;
    border: 2px solid ${({ theme }) => theme.border};
  }
`;
