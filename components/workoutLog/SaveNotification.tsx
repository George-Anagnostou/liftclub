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
          <Checkmark styles={{ height: 30, width: 30, transform: "scale(.85)" }} />
        </div>
      )}
    </Circle>
  );
};

const Circle = styled.div`
  width: 65px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.buttonMed};
  box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

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
  width: 12px;
  height: 12px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.accentSoft};
  animation: dotFlashing 0.5s infinite linear alternate;
  animation-delay: 0.2s;

  &::before,
  &::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
  }

  &::before {
    left: -17px;
    width: 12px;
    height: 12px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accentSoft};
    animation: dotFlashing 0.5s infinite alternate;
    animation-delay: 0s;
  }

  &::after {
    left: 17px;
    width: 12px;
    height: 12px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accentSoft};
    animation: dotFlashing 0.5s infinite alternate;
    animation-delay: 0.4s;
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
