import React from "react";
import styled from "styled-components";
// Components
import Checkmark from "../Checkmark";
import LoadingSpinner from "../LoadingSpinner";

interface Props {
  saveWorkout: () => Promise<void>;
  saveLoading: boolean;
  saveSuccess: boolean | null;
}

const SaveButton: React.FC<Props> = ({ saveWorkout, saveLoading, saveSuccess }) => {
  return (
    <SaveBtn onClick={saveWorkout} disabled={saveLoading}>
      {saveLoading ? (
        <LoadingSpinner styles={{ height: 24, width: 24 }} />
      ) : saveSuccess ? (
        "SAVED"
      ) : (
        "SAVE"
      )}
      {saveSuccess && <Checkmark position={{ position: "absolute", top: "5px", right: "15px" }} />}
    </SaveBtn>
  );
};

export default SaveButton;

const SaveBtn = styled.button`
  width: 100%;
  position: sticky;
  top: 0.5rem;
  margin: 0rem auto 0.5rem;
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 10px;

  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.background};
  border: 3px solid ${({ theme }) => theme.border};
  box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};

  &:disabled {
    opacity: 0.5;
  }
`;
