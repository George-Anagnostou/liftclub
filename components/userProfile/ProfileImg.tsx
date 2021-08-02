import React, { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
// Interfaces
import { User } from "../../utils/interfaces";
import ProfileImgModal from "./ProfileImgModal";

interface Props {
  profileData: User;
  isProfileOwner: boolean;
  setProfileData: React.Dispatch<React.SetStateAction<User | null>>;
}

const ProfileImg: React.FC<Props> = ({ profileData, setProfileData, isProfileOwner }) => {
  const [showIconSelect, setShowIconSelect] = useState(false);

  const toggleShowIconSelect = () => setShowIconSelect(!showIconSelect);

  return (
    <>
      <ProfileImage>
        {profileData.profileImgUrl ? (
          // Show uploaded image
          <img
            src={profileData.profileImgUrl}
            onClick={isProfileOwner ? toggleShowIconSelect : () => {}}
          />
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
        <ProfileImgModal
          setShowIconSelect={setShowIconSelect}
          showIconSelect={showIconSelect}
          setProfileData={setProfileData}
        />
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
  border: 3px solid ${({ theme }) => theme.buttonMed};
  overflow: hidden;
  display: grid;
  place-items: center;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

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
