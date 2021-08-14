import React from "react";
import styled from "styled-components";

import { Workout } from "../../../utils/interfaces";

interface Props {
  selectedDate: string;
  selectedWorkout: Workout | null;
}

const DateData: React.FC<Props> = ({ selectedDate, selectedWorkout }) => {
  return (
    <DataContainer>
      {selectedDate ? (
        selectedWorkout ? (
          <p>{selectedWorkout.name}</p>
        ) : (
          <p className="textLight">No workout today</p>
        )
      ) : (
        <p className="textLight">Tap a date to view its workout</p>
      )}
    </DataContainer>
  );
};

export default DateData;

const DataContainer = styled.div`
  margin: 0.5rem auto;
  background: ${({ theme }) => theme.background};
  padding: 0.5rem;
  border-radius: 5px;

  p {
    flex: 1;
    font-size: 1.1rem;

    &.textLight {
      color: ${({ theme }) => theme.textLight};
    }
  }
`;
