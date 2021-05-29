import styled from "styled-components";
import { useState } from "react";

import { createExercise } from "../../utils/api";

export default function CreateExerciseModal({ muscleGroups, setShowModal }) {
  const [name, setName] = useState("");
  const [equipment, setEquipment] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [muscleWorked, setMuscleWorked] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    createExercise({ name, equipment, muscleGroup, muscleWorked });

    setName("");
    setEquipment("");
    setMuscleGroup("");
    setMuscleWorked("");
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleEquipmentChange = (e) => {
    setEquipment(e.target.value);
  };
  const handleMuscleGroupChange = (e) => {
    setMuscleGroup(e.target.value);
  };
  const handleMuscleWorkedChange = (e) => {
    setMuscleWorked(e.target.value);
  };

  const handleModalShadowClick = (e) => {
    // Only close the modal when the shadow is clicked
    if (e.target.classList.contains("modal-shadow")) setShowModal(false);
  };

  return (
    <ModalContainer className="modal-shadow" onClick={handleModalShadowClick}>
      <div className="modal">
        <button className="close-btn" onClick={() => setShowModal(false)}>
          X
        </button>

        <form action="POST" onSubmit={handleFormSubmit}>
          <h3>Create a New Exercise</h3>

          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" value={name} onChange={handleNameChange} required />
          </div>

          <div>
            <label htmlFor="equipment">Equipment:</label>
            <input
              type="text"
              name="equipment"
              value={equipment}
              onChange={handleEquipmentChange}
              required
            />
          </div>

          <div>
            <label htmlFor="muscleGroup">Muscle Group:</label>
            <select name="muscleGroup" onChange={handleMuscleGroupChange}>
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="muscleWorked">Muscle Worked:</label>
            <input
              type="text"
              name="muscleWorked"
              value={muscleWorked}
              onChange={handleMuscleWorkedChange}
              required
            />
          </div>

          <button type="submit">Add Exercise</button>
        </form>
      </div>
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);

  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;

  display: grid;
  place-items: center;

  .modal {
    position: relative;
    height: 50%;
    width: 95%;
    max-width: 350px;
    border-radius: 5px;
    background: ${({ theme }) => theme.buttonLight};
    border: 3px solid ${({ theme }) => theme.accentSoft};
    box-shadow: 0 0 10px ${({ theme }) => theme.boxShadow};

    display: grid;
    place-items: center;

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

    form {
      height: 100%;
      width: 100%;
      padding: 1rem;

      display: flex;
      flex-direction: column;
      justify-content: space-around;

      div {
        width: 100%;
        display: flex;
        text-align: left;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;

        label {
          font-size: 0.8rem;
          color: ${({ theme }) => theme.textLight};
          text-transform: uppercase;
        }

        input {
          width: 100%;
          margin: 0.5rem 0;
          padding: 0.5rem;
          font-size: 1rem;
          border: none;
          border-radius: 5px;
          color: ${({ theme }) => theme.text};
          background: ${({ theme }) => theme.buttonMed};
        }

        select {
          width: 50%;
          margin: 0.5rem 0;
          padding: 0.5rem;
          font-size: 1rem;
          border: none;
          border-radius: 5px;
          color: ${({ theme }) => theme.text};
          background: ${({ theme }) => theme.buttonMed};
        }
      }

      button {
        background: ${({ theme }) => theme.buttonLight};
        box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
        color: inherit;
        border: none;
        border-radius: 3px;
        margin: 1rem 2rem;
        padding: 0.5rem 1rem;
        font-size: 1.1rem;
      }
    }
  }
`;
