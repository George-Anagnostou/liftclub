import { useState, useEffect } from "react";
import styled from "styled-components";

// API
import { saveWeight } from "../../utils/api";
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

    if (!inputWeight) return;

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
        <label htmlFor="weight" className="title">
          Weight:
        </label>
        <input type="number" name="weight" onChange={handleWeightChange} value={inputWeight} />

        <button type="submit">SAVE</button>
        {saved && <Checkmark position={CheckmarkPosition} />}
      </form>

      <div className="container">
        <div className="weightDiff">
          {weightDiff > 0 ? (
            <p>
              Total gained: <span>{weightDiff}</span> lbs
            </p>
          ) : (
            <p>
              Total lost: <span>{Math.abs(weightDiff)}</span> lbs
            </p>
          )}
        </div>

        <div className="displayWeight">
          <p>
            Previous: <span>{displayWeight}</span> lbs
          </p>
        </div>
      </div>
    </WeightContainer>
  );
}

const WeightContainer = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  margin: 1rem;
  border-radius: 5px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textLight};

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  form {
    display: flex;
    align-items: center;

    .title {
      font-weight: thin;
    }

    input {
      text-align: center;
      width: 4rem;
      margin: 0.5rem;
      padding: 0.2rem 0.5rem;
      font-size: 1.35rem;
      border: none;
      border-radius: 5px;
      color: ${({ theme }) => theme.text};
      border: 1px solid ${({ theme }) => theme.border};
      background: inherit;
    }

    button {
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      color: ${({ theme }) => theme.accentText};
      border: 1px solid ${({ theme }) => theme.accentSoft};
      background: ${({ theme }) => theme.accent};
    }
  }

  .container {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  span {
    font-weight: thin;
    font-size: 1.35rem;
    color: ${({ theme }) => theme.text};
  }

  .displayWeight {
    margin: 0.5rem 0;
  }

  .weightDiff {
    margin: 0.5rem 0;
  }
`;
