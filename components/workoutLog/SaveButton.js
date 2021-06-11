import React from "react";
import styled from "styled-components";
import Checkmark from "../Checkmark";

export default function SaveButton({ saveWorkout, savedSuccessfully }) {
  return (
    <SaveBtn onClick={saveWorkout}>
      Save Workout
      {savedSuccessfully && (
        <Checkmark position={{ position: "absolute", top: "15px", right: "15px" }} />
      )}
    </SaveBtn>
  );
}

const SaveBtn = styled.button`
  width: 100%;
  position: sticky;
  top: 0.5rem;
  margin: 1rem auto;
  font-size: 1.5rem;
  padding: 0.75rem 0.5rem;
  border-radius: 10px;

  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
`;
