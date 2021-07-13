import styled from "styled-components";
import { useState } from "react";
// Utils
import { createExercise } from "../../../utils/api";
// Components
import Modal from "../../Wrappers/Modal";

const muscleGroups = [
  "upper back",
  "lower back",
  "shoulder",
  "upper arm",
  "forearm",
  "chest",
  "hip",
  "upper leg",
  "lower leg",
  "core",
];

export default function CreateExerciseModal({ setShowModal, showModal }) {
  const [name, setName] = useState("");
  const [equipment, setEquipment] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [muscleWorked, setMuscleWorked] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const saved = await createExercise({ name, equipment, muscleGroup, muscleWorked });
    if (saved) {
      setName("");
      setEquipment("");
      setMuscleGroup("");
      setMuscleWorked("");
    }
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

  return (
    <Modal isOpen={showModal} removeModal={() => setShowModal(false)}>
      <Container>
        <button className="close-btn" onClick={() => setShowModal(false)}>
          X
        </button>

        <form action="POST" onSubmit={handleFormSubmit}>
          <h3>New Exercise</h3>

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
            <select
              name="muscleGroup"
              onChange={handleMuscleGroupChange}
              defaultValue={"none"}
              required
            >
              <option value="none" disabled>
                Select One
              </option>

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
      </Container>
    </Modal>
  );
}

const Container = styled.div`
  width: 95%;
  margin: 10vh auto 0;
  max-width: 350px;
  border-radius: 10px;
  background: ${({ theme }) => theme.buttonLight};
  box-shadow: 0 0 10px ${({ theme }) => theme.boxShadow};
  position: relative;

  display: grid;
  place-items: center;

  .close-btn {
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
    border: none;
    border-radius: 3px;
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 5px 8px;
    font-size: 10px;
  }

  form {
    height: 100%;
    width: 100%;
    padding: 1rem;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    h3 {
      color: ${({ theme }) => theme.textLight};
      font-weight: 300;
    }

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
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 1px 2px ${({ theme }) => theme.boxShadow};
      color: inherit;
      border: none;
      border-radius: 5px;
      margin: auto;
      padding: 0.5rem 1rem;
      font-size: 1.1rem;
    }
  }
`;
