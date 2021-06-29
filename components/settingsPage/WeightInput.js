import { useState, useEffect } from "react";
import styled from "styled-components";
import { useStoreState } from "../../store";

// API
import { saveUserWeight } from "../../utils/api";

export default function WeightInput() {
  const { user } = useStoreState();

  const [inputWeight, setInputWeight] = useState("");
  const [displayWeight, setDisplayWeight] = useState(0);
  const [weightDiff, setWeightDiff] = useState(0);

  const handleWeightChange = (e) => setInputWeight(e.target.value);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!inputWeight) return;

    // send POST req
    const isSaved = await saveUserWeight(inputWeight, user._id);

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
    if (user.weight) {
      const currWeight = user.weight[user.weight.length - 1] || 0;
      const initialWeight = user.weight[0] || 0;
      setDisplayWeight(currWeight);
      setWeightDiff(currWeight - initialWeight);
    }
  }, [user]);

  return (
    <WeightContainer>
      <h3 className="title">Weight</h3>

      <div className="innerInfo">
        <form method="post" onSubmit={handleSave}>
          <p>Current •</p>
          <input type="number" name="weight" onChange={handleWeightChange} value={inputWeight} />
          <button type="submit" disabled={!inputWeight}>
            save
          </button>
        </form>

        <div className="displayWeight">
          <p>
            Previous • <span>{displayWeight}</span> lbs
          </p>
        </div>

        <div className="weightDiff">
          {weightDiff > 0 ? (
            <p>
              Total gain • <span>{weightDiff}</span> lbs
            </p>
          ) : (
            <p>
              Total loss • <span>{Math.abs(weightDiff)}</span> lbs
            </p>
          )}
        </div>
      </div>
    </WeightContainer>
  );
}

const WeightContainer = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 0.5rem;
  border-radius: 10px;
  text-align: left;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .innerInfo {
    padding: 0 0.5rem;
    font-size: 1.2rem;

    form {
      display: flex;
      align-items: center;

      input {
        text-align: center;
        width: 4rem;
        margin: 0.35rem 0.5rem;
        padding: 0.1rem 0.5rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 5px;
        color: ${({ theme }) => theme.text};
        border: 1px solid ${({ theme }) => theme.border};
        background: inherit;
      }

      button {
        padding: 0.35rem 0.5rem;
        border-radius: 5px;
        border: none;
        color: ${({ theme }) => theme.accentText};
        background: ${({ theme }) => theme.accent};
        transition: all 0.2s ease;

        &:disabled {
          color: ${({ theme }) => theme.border};
          background: ${({ theme }) => theme.buttonMed};
        }
      }
    }
  }

  span {
    font-weight: thin;
    color: ${({ theme }) => theme.text};
  }

  .displayWeight {
    margin-bottom: 0.5rem;
  }

  .weightDiff {
    margin-bottom: 0.5rem;
  }
`;
