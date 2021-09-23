import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
// API
import { saveUserBio } from "../../utils/api";
// Interfaces
import { User } from "../../utils/interfaces";

interface Props {
  profileData: User;
  isProfileOwner: boolean;
  setProfileData: React.Dispatch<React.SetStateAction<User | null>>;
  user_id: string;
}
const Bio: React.FC<Props> = ({ profileData, isProfileOwner, setProfileData, user_id }) => {
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
      setProfileData((prev: User) => ({ ...prev, bio: bioEdits }));
      setEditing(false);
    }
  };

  const handleBioChange = ({ target }) => setBioEdits(target.value);

  useEffect(() => {
    setBioEdits(profileData.bio || "");
  }, [profileData.bio]);

  return (
    <BioContainer>
      <div className="topbar">
        <h3 className="title">Bio</h3>

        {isProfileOwner && !editing && <button onClick={handleEditClick}>Edit</button>}

        {editing && <button onClick={handleCancleClick}>Cancel</button>}
      </div>

      {editing ? (
        <textarea
          value={bioEdits}
          onChange={handleBioChange}
          placeholder="Add a summary about your fitness experience or share your workout goals."
          rows={4}
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
};
export default Bio;

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
    align-items: flex-start;

    button {
      border-radius: 5px;
      padding: 0.1rem 0.5rem;
      border: none;
      background: ${({ theme }) => theme.buttonMed};
      color: ${({ theme }) => theme.textLight};
      font-size: 0.8rem;
    }
  }

  textarea {
    line-height: 1.2rem;
    letter-spacing: 0.5px;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 200;
    width: 100%;
    min-height: 75px;
    resize: vertical;
    padding: 0.25rem;
    border: none;
    border-radius: 5px;
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.body};
    margin: 0;
    border: 2px solid ${({ theme }) => theme.body};

    &:focus {
      outline: none;
      border: 2px solid ${({ theme }) => theme.accentSoft};
    }
  }

  p {
    line-height: 1.2rem;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    padding: calc(0.25rem + 2px);
    margin: 0;
    font-weight: 200;
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
