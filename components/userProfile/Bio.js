import React, { useState } from "react";
import styled from "styled-components";
// API
import { saveUserBio } from "../../utils/api";

export default function Bio({ profileData, isProfileOwner, setProfileData, user_id }) {
  const [editing, setEditing] = useState(false);
  const [bioEdits, setBioEdits] = useState(profileData.bio || "");

  const handleEditClick = () => setEditing(true);

  const handleCancleClick = () => {
    setEditing(false);
    setBioEdits(profileData.bio || "");
  };

  const handleSaveClick = async () => {
    const saved = await saveUserBio(user_id, bioEdits);
    if (saved) {
      setProfileData((prev) => ({ ...prev, bio: bioEdits }));
      setEditing(false);
    }
  };

  const handleBioChange = ({ target }) => setBioEdits(target.value);

  return (
    <BioContainer>
      <div className="topbar">
        <h3 className="title">Bio</h3>

        {isProfileOwner && !editing && <button onClick={handleEditClick}>Edit</button>}

        {editing && <button onClick={handleCancleClick}>Cancel</button>}
      </div>

      {editing ? (
        <textarea
          type="text"
          value={bioEdits}
          onChange={handleBioChange}
          placeholder="Add a summary about your fitness experience or share your workout goals."
          rows="4"
          autoFocus
          onFocus={({ target }) => {
            const val = target.value;
            target.value = "";
            target.value = val;
          }}
        ></textarea>
      ) : (
        <p>{profileData.bio || "None"}</p>
      )}

      {editing && <SaveBtn onClick={handleSaveClick}>Save</SaveBtn>}
    </BioContainer>
  );
}

const BioContainer = styled.section`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 0.5rem;
  border-radius: 10px;
  text-align: left;

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    button {
      border-radius: 5px;
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      border: ${({ theme }) => theme.border};
      color: ${({ theme }) => theme.textLight};
      background: ${({ theme }) => theme.buttonMed};
    }
  }

  textarea {
    line-height: 1.3rem;
    letter-spacing: 0.5px;
    font-family: inherit;
    font-size: 1rem;
    width: 100%;
    min-height: 75px;
    resize: vertical;
    padding: 0.5rem;
    border: none;
    border-radius: 5px;
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.buttonMed};
    margin: 0.5rem 0 0.25rem;
  }

  p {
    line-height: 1.3rem;
    letter-spacing: 0.5px;
    padding: 0.5rem;
    margin: 0.5rem 0;
  }
`;

const SaveBtn = styled.button`
  float: right;
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.accentText};
  background: ${({ theme }) => theme.accentSoft};
`;
