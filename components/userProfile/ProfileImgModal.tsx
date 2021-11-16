import React, { useState } from "react";
import styled from "styled-components";
// Wrapper
import Modal from "../Wrappers/Modal";
// Interfaces
import UploadImgToS3 from "./UploadImgToS3";
// Interfaces
import { User } from "../../types/interfaces";
import { saveProfileImgUrl } from "../../api-lib/fetchers";
import { useUserState } from "../../store";

const icons = ["default-man", "default-woman"];

interface Props {
  setShowProfileImgModal: React.Dispatch<React.SetStateAction<boolean>>;
  showProfileImgModal: boolean;
  setProfileData: React.Dispatch<React.SetStateAction<User | null>>;
}

const ProfileImgModal: React.FC<Props> = ({
  setShowProfileImgModal,
  showProfileImgModal,
  setProfileData,
}) => {
  const { user } = useUserState();

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
    <Modal removeModal={() => setShowProfileImgModal(false)} isOpen={showProfileImgModal}>
      <Box>
        <button className="close-btn" onClick={() => setShowProfileImgModal(false)}>
          X
        </button>

        <UploadImgToS3 setProfileData={setProfileData} />

        <DefaultIcons onSubmit={handleIconFormSubmit} action="POST">
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
        </DefaultIcons>
      </Box>
    </Modal>
  );
};
export default ProfileImgModal;

const Box = styled.div`
  padding: 1rem 3rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.background};
  position: relative;
  width: fit-content;
  margin: 10vh auto 0;

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
    border: none;
    border-radius: 3px;
    font-size: 10px;
    cursor: pointer;
  }
`;

const DefaultIcons = styled.form`
  button {
    background: ${({ theme }) => theme.buttonMed};
    box-shadow: 0 1px 2px ${({ theme }) => theme.boxShadow};
    color: inherit;
    border: none;
    border-radius: 5px;
    padding: 0.25rem 0.5rem;

    font-size: 1rem;
    transition: all 0.3s ease;
    display: block;
    margin: auto;

    &:disabled {
      color: ${({ theme }) => theme.border};
      background: ${({ theme }) => theme.background};
    }
  }
`;

const Icon = styled.div`
  background: ${({ theme }) => theme.buttonMed};
  border: 3px solid ${({ theme }) => theme.buttonMed};
  height: 100px;
  width: 100px;
  margin: 0 0.5rem;
  border-radius: 50%;
  overflow: hidden;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  cursor: pointer;

  &.selected {
    border: 3px solid ${({ theme }) => theme.border};
    transform: scale(1.1);
  }
  &.fade {
    opacity: 0.5;
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;
