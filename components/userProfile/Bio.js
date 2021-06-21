import React, { useState } from "react";
import styled from "styled-components";
// API
import { saveBio } from "../../store/actions/userActions";

export default function Bio({ profileData, isProfileOwner, setProfileData, user_id }) {
  const [editing, setEditing] = useState(false);
  const [bioEdits, setBioEdits] = useState(profileData.bio || "");

  const handleEditClick = () => setEditing(true);

  const handleCancleClick = () => {
    setEditing(false);
    setBioEdits(profileData.bio || "");
  };

  const handleSaveClick = async () => {
    const saved = await saveBio(user_id, bioEdits);
    if (saved) {
      setProfileData((prev) => ({ ...prev, bio: bioEdits }));
      setEditing(false);
    }
  };

  const handleBioChange = ({ target }) => setBioEdits(target.value);

  return (
    <BioContainer>
      <h3>Bio</h3>
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

      {isProfileOwner && !editing && <EditBtn onClick={handleEditClick}>Edit</EditBtn>}

      {editing && <CancelBtn onClick={handleCancleClick}>Cancel</CancelBtn>}

      {editing && <SaveBtn onClick={handleSaveClick}>Save</SaveBtn>}
    </BioContainer>
  );
}

const BioContainer = styled.section`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 1rem 1rem;
  border-radius: 10px;
  text-align: left;

  h3 {
    font-weight: 100;
    letter-spacing: 1px;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }

  textarea {
    letter-spacing: 1px;
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
    margin-bottom: 1.5rem;
  }

  p {
    letter-spacing: 1px;
    padding: 0.5rem;
  }
`;

const EditBtn = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.buttonMed};
`;

const CancelBtn = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.buttonMed};
`;

const SaveBtn = styled.button`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.buttonMed};
`;
