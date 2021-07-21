import React, { useState } from "react";
import styled from "styled-components";
// Wrapper
import Modal from "../Wrappers/Modal";
// Interfaces
import UploadImgToS3 from "./UploadImgToS3";
// Interfaces
import { User } from "../../utils/interfaces";

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
  const [selectedIcon, setSelectedIcon] = useState("");
  const [icons, setIcons] = useState(["ICON 1", "ICON 2", "ICON 3", "ICON 4", "ICON 5", "ICON 6"]);

  const handleIconClick = (icon: string) => setSelectedIcon(icon);

  const handleIconFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e);
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
              className={selectedIcon === icon ? "selected" : ""}
            >
              {icon}
            </Icon>
          ))}
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
  justify-content: center;
  align-items: center;
`;

const Icon = styled.div`
  background: ${({ theme }) => theme.buttonMed};
  border: 3px solid ${({ theme }) => theme.buttonMed};
  height: 100px;
  width: 100px;
  margin: 1rem 0.5rem;
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
