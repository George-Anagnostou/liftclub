import React, { useState } from "react";
import styled from "styled-components";
// Wrapper
import Modal from "../Wrappers/Modal";
// Interfaces
import UploadImgToS3 from "./UploadImgToS3";
// Interfaces
import { User } from "../../utils/interfaces";
import { saveProfileImgUrl } from "../../utils/api";
import { useStoreState } from "../../store";

const icons = ["default-man", "default-woman"];

interface Props {
  setShowIconSelect: React.Dispatch<React.SetStateAction<boolean>>;
  showIconSelect: boolean;
  setProfileData: React.Dispatch<React.SetStateAction<User | null>>;
}

const ProfileImgModal: React.FC<Props> = ({
  setShowIconSelect,
  setProfileData,
  showIconSelect,
}) => {
  const { user } = useStoreState();

  const [selectedDefaultIcon, setSelectedDefaultIcon] = useState("");

  const handleIconClick = (icon: string) =>
    setSelectedDefaultIcon(icon === selectedDefaultIcon ? "" : icon);

  const handleIconFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const profileImgUrl = `https://lift-club-profile-imgs.s3.us-west-1.amazonaws.com/${selectedDefaultIcon}.jpg`;

    const saved = await saveProfileImgUrl(user!._id, profileImgUrl);
    if (saved) {
      setProfileData((prev) => prev && { ...prev, profileImgUrl: "" });
      setProfileData((prev) => prev && { ...prev, profileImgUrl });
    }
  };

  return (
    <Modal removeModal={() => setShowIconSelect(false)} isOpen={showIconSelect}>
      <Box>
        <button className="close-btn" onClick={() => setShowIconSelect(false)}>
          X
        </button>

        <UploadImgToS3 setProfileData={setProfileData} />

        <IconSelectForm onSubmit={handleIconFormSubmit} action="POST">
          {icons.map((icon) => (
            <Icon
              key={icon}
              onClick={() => handleIconClick(icon)}
              className={
                selectedDefaultIcon ? (selectedDefaultIcon === icon ? "selected" : "fade") : ""
              }
            >
              <img
                src={`https://lift-club-profile-imgs.s3.us-west-1.amazonaws.com/${icon}.jpg`}
                alt=""
              />
            </Icon>
          ))}

          <button type="submit" disabled={!selectedDefaultIcon}>
            Save
          </button>
        </IconSelectForm>
      </Box>
    </Modal>
  );
};
export default ProfileImgModal;

const Box = styled.div`
  margin: 10vh 0.5rem 0;
  padding: 1rem 0rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.background};
  position: relative;

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
    border: none;
    border-radius: 3px;
    height: 15px;
    width: 15px;
    font-size: 10px;
  }
`;

const IconSelectForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;

  button {
    width: 100px;
    background: ${({ theme }) => theme.buttonMed};
    box-shadow: 0 1px 2px ${({ theme }) => theme.boxShadow};
    color: inherit;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    border: 1px solid ${({ theme }) => theme.border};
    font-size: 1.2rem;
    transition: all 0.3s ease;

    &:disabled {
      color: ${({ theme }) => theme.border};
      background: ${({ theme }) => theme.background};
      border: 1px solid ${({ theme }) => theme.buttonLight};
    }
  }
`;

const Icon = styled.div`
  background: ${({ theme }) => theme.buttonMed};
  border: 3px solid ${({ theme }) => theme.buttonMed};
  height: 100px;
  width: 100px;
  margin-right: 0.5rem;
  border-radius: 50%;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;

  &.selected {
    border: 3px solid ${({ theme }) => theme.border};
    transform: scale(1.1);
  }
  &.fade {
    opacity: 0.5;
  }

  input {
    height: 100%;
    width: 100%;
    background: inherit;
  }
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;
