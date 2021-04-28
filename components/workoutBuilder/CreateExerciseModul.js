import styled from "styled-components";
import { useState } from "react";

import { createExercise } from "../../utils/ApiSupply";

export default function CreateExerciseModul({ muscleGroups, setShowModul }) {
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

  const handleModulShadowClick = (e) => {
    // Only close the modul when the shadow is clicked
    if (e.target.classList.contains("modul-shadow")) setShowModul(false);
  };

  return (
    <ModulContainer className="modul-shadow" onClick={handleModulShadowClick}>
      <div className="modul">
        <button className="close-btn" onClick={() => setShowModul(false)}>
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
    </ModulContainer>
  );
}

const ModulContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.2);

  position: fixed;
  top: 0;
  left: 0;

  display: grid;
  place-items: center;

  .modul {
    position: relative;
    height: 50%;
    width: 95%;
    max-width: 350px;
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 5px grey;

    display: grid;
    place-items: center;

    .close-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;

      padding: 0.25rem;
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
        justify-content: space-between;
      }

      button {
        margin: 0 auto;
        padding: 0.5rem;
      }
    }
  }
`;
