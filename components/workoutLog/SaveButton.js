import React from "react";
import styled from "styled-components";
import Checkmark from "../Checkmark";

export default function SaveButton({ saveWorkout, savedSuccessfully, deleteWorkout }) {
  return (
    <>
      <SaveBtn onClick={saveWorkout}>
        Save Workout
        {savedSuccessfully && (
          <Checkmark position={{ position: "absolute", top: "15px", right: "15px" }} />
        )}
      </SaveBtn>

      <button onClick={deleteWorkout}>DELETE WORKOUT</button>
    </>
  );
}

const SaveBtn = styled.button`
  width: 98%;
  position: sticky;
  top: 0.5rem;
  margin: 1rem auto;
  font-size: 1.5rem;
  padding: 1rem 0.5rem;
  border-radius: 5px;

  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.buttonLight};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
`;
