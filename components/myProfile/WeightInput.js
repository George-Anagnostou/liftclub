import { useState, useEffect } from "react";
import styled from "styled-components";

import { saveWeight } from "../../store";
import Checkmark from "../Checkmark";

const CheckmarkPosition = {
  display: "inline-block",
};

export default function WeightInput({ user }) {
  const [inputWeight, setInputWeight] = useState("");
  const [saved, setSaved] = useState(null);
  const [displayWeight, setDisplayWeight] = useState(0);
  const [weightDiff, setWeightDiff] = useState(0);

  const handleWeightChange = (e) => setInputWeight(e.target.value);

  const handleSave = async (e) => {
    e.preventDefault();

    // send POST req
    const isSaved = await saveWeight(inputWeight, user._id);

    // if saved successfully, notify user
    setSaved(isSaved);

    if (isSaved) {
      // update weightDiff only if user has weight defined
      if (displayWeight) setWeightDiff(weightDiff - (displayWeight - inputWeight));
      // change displayWeight to newly inputWeight
      setDisplayWeight(inputWeight);
    }

    // Clear weight input
    setInputWeight("");
  };

  useEffect(() => {
    let timeout;
    if (saved) timeout = setTimeout(() => setSaved(null), 3000);

    return () => clearTimeout(timeout);
  }, [saved]);

  useEffect(() => {
    if (user.weight) {
      const currWeight = user.weight[user.weight.length - 1] || 0;
      const initialWeight = user.weight[0] || 0;
      setDisplayWeight(currWeight);
      setWeightDiff(currWeight - initialWeight);
    }
  }, [user]);

  return (
    <WeightContainer>
      <form method="post" onSubmit={handleSave}>
        <label htmlFor="weight">Bodyweight:</label>
        <input type="number" name="weight" onChange={handleWeightChange} value={inputWeight} />

        <button type="submit">save</button>
        {saved && <Checkmark position={CheckmarkPosition} />}
      </form>

      <div className="displayWeight">
        <p>Last weight: {displayWeight} lbs</p>
      </div>
      <div className="weightDiff">
        {weightDiff > 0 ? (
          <p>You have gained {weightDiff} lbs</p>
        ) : (
          <p>You have lost {Math.abs(weightDiff)} lbs</p>
        )}
      </div>
    </WeightContainer>
  );
}

const WeightContainer = styled.div`
  width: 100%;

  padding: 0 1rem;
  margin-top: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  form {
    display: flex;
    align-items: center;

    input {
      margin-left: 0.5rem;
      max-width: 4rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      outline: none;
      padding: 0.5rem 0 0.5rem 0.5rem;
      font-size: inherit;
      background: inherit;
      color: inherit;
    }

    button {
      border-radius: 5px;
      border: 1px solid #ccc;
      padding: 0.5rem;
      font-size: inherit;
      color: inherit;
      margin: 0 0.5rem;
    }
  }

  .displayWeight {
    display: flex;
    align-items: center;

    p {
      margin: 0.5rem 0;
    }
  }

  .weightDiff {
    p {
      margin: 0.5rem 0;
    }
  }
`;
