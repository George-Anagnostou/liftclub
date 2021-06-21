import React, { useState } from "react";
import Image from "next/image";
import styled from "styled-components";

export default function ProfileImg({ profileData, isProfileOwner }) {
  const [showIconSelect, setShowIconSelect] = useState(false);

  const toggleShowIconSelect = () => setShowIconSelect(!showIconSelect);

  return (
    <>
      <ProfileImage>
        {profileData.profileImg ? (
          <Image src="/favicon.jpeg" height="100" width="100"></Image>
        ) : isProfileOwner ? (
          <div className="addImgIcon" onClick={toggleShowIconSelect}>
            <span></span>
            <span></span>
            <p>ADD IMAGE</p>
          </div>
        ) : (
          <div>Default</div>
        )}
      </ProfileImage>

      {showIconSelect && (
        <IconSelect>
          <div className="container">
            <button onClick={toggleShowIconSelect}>X</button>
            <div>ICON 1</div>
            <div>ICON 2</div>
            <div>ICON 3</div>
            <div>ICON 4</div>
            <div>ICON 5</div>
            <div>ICON 6</div>
            <div>CUSTOM</div>
          </div>
        </IconSelect>
      )}
    </>
  );
}

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

const IconSelect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.opacityBackground};
  z-index: 99;

  .container {
    margin: 20vh auto 0;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 10px;
    background: ${({ theme }) => theme.background};
    max-width: 400px;
    width: 95%;
    /* height: 50vh; */
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
    div {
      background: ${({ theme }) => theme.buttonMed};
      height: 100px;
      width: 100px;
      margin: 1rem 0.5rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;
