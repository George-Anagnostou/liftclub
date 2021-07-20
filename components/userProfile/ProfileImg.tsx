import React, { useEffect, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
// Wrapper
import Modal from "../Wrappers/Modal";
// Interfaces
import { User } from "../../utils/interfaces";

interface Props {
  profileData: User;
  isProfileOwner: boolean;
}

const ProfileImg: React.FC<Props> = ({ profileData, isProfileOwner }) => {
  const [showIconSelect, setShowIconSelect] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [icons, setIcons] = useState(["ICON 1", "ICON 2", "ICON 3", "ICON 4", "ICON 5", "ICON 6"]);
  const [uploadedImg, setUploadedImg] = useState<{ file: any; imagePreviewUrl: any } | null>(null);

  const toggleShowIconSelect = () => setShowIconSelect(!showIconSelect);

  const handleIconClick = (icon: string) => setSelectedIcon(icon);

  const handleIconFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e);
  };

  const handleUserImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    let reader = new FileReader();
    let file = e.target!.files[0]!;

    console.log(file);

    if (!file) return;

    reader.onloadend = () => {
      setUploadedImg({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    console.log(uploadedImg);
  }, [uploadedImg]);

  return (
    <>
      <ProfileImage>
        {profileData.profileImg ? (
          // Show uploaded image
          <Image
            src="/favicon.png"
            height="100"
            width="100"
            onClick={isProfileOwner ? toggleShowIconSelect : () => {}}
          ></Image>
        ) : isProfileOwner ? (
          // User is profile owner and Add Icon is shown
          <div className="addImgIcon" onClick={toggleShowIconSelect}>
            <span></span>
            <span></span>
            <p>ADD IMAGE</p>
          </div>
        ) : (
          // Show default image for users who have no profileImg saved
          <Image src="/favicon.png" height="100" width="100"></Image>
        )}
      </ProfileImage>

      {showIconSelect && (
        <Modal removeModal={() => setShowIconSelect(false)} isOpen={showIconSelect}>
          <IconSelectForm onSubmit={handleIconFormSubmit} action="POST">
            <button onClick={toggleShowIconSelect}>X</button>

            {icons.map((icon) => (
              <Icon
                key={icon}
                onClick={() => handleIconClick(icon)}
                className={selectedIcon === icon ? "selected" : ""}
              >
                {icon}
              </Icon>
            ))}

            <Icon key="user-upload">
              <input
                type="file"
                name="profileImg"
                onChange={handleUserImgUpload}
                // batch="false"
                // restrictions={{ allowedExtensions: [".jpg", ".png"], maxFileSize: 100000 }}
              />
            </Icon>
          </IconSelectForm>
        </Modal>
      )}
    </>
  );
};
export default ProfileImg;

const ProfileImage = styled.div`
  border-radius: 50%;
  height: 100px;
  width: 100px;
  background: ${({ theme }) => theme.buttonMed};
  overflow: hidden;
  display: grid;
  place-items: center;

  .addImgIcon {
    height: 100%;
    width: 100%;
    position: relative;

    span {
      position: absolute;
      bottom: 60px;
      right: 0;
      left: 0;
      margin: auto;
      display: block;
      height: 5px;
      width: 35px;
      background: ${({ theme }) => theme.background};
      border-radius: 7px;

      &:first-of-type {
        transform: rotate(90deg);
      }
    }

    p {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      margin: auto;
      color: ${({ theme }) => theme.textLight};
      font-size: 0.7rem;
    }
  }
`;

const IconSelectForm = styled.form`
  margin: 10vh 0.5rem 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.background};
  position: relative;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  button {
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
`;
