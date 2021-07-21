import React from "react";
import styled from "styled-components";
import Checkmark from "../Checkmark";

interface Props {
  saveLoading: boolean;
}

export const SaveNotification: React.FC<Props> = ({ saveLoading }) => {
  return (
    <Circle>
      {saveLoading ? (
        <LoadingDots />
      ) : (
        <div className="saved">
          <h3>SAVED</h3>
          <Checkmark styles={{ height: 28, width: 18, transform: "scale(.5)" }} />
        </div>
      )}
    </Circle>
  );
};

const Circle = styled.div`
  width: 68px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.buttonMed};
  box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};

  h3 {
    font-size: 60%;
    font-weight: 300;
    color: ${({ theme }) => theme.textLight};
  }

  .saved {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    animation: fadeIn 0.3s linear forwards;

    @keyframes fadeIn {
      100% {
        opacity: 1;
      }
    }
  }
`;

const LoadingDots = styled.div`
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.accentSoft};
  animation: dotFlashing 0.7s infinite linear alternate;
  animation-delay: 0.35s;

  &::before,
  &::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
  }

  &::before {
    left: -15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accentSoft};
    animation: dotFlashing 0.7s infinite alternate;
    animation-delay: 0s;
  }

  &::after {
    left: 15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accentSoft};
    animation: dotFlashing 0.7s infinite alternate;
    animation-delay: 0.7s;
  }

  @keyframes dotFlashing {
    0% {
      background-color: ${({ theme }) => theme.accentSoft};
    }
    50%,
    100% {
      background-color: ${({ theme }) => theme.buttonLight};
    }
  }
`;
