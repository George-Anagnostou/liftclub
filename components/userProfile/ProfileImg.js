import React, { useRef, useState } from "react";
import Image from "next/image";
import styled from "styled-components";

export default function ProfileImg({ profileData, isProfileOwner }) {
  const shadow = useRef(null);

  const [showIconSelect, setShowIconSelect] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [icons, setIcons] = useState(["ICON 1", "ICON 2", "ICON 3", "ICON 4", "ICON 5", "ICON 6"]);

  const toggleShowIconSelect = () => setShowIconSelect(!showIconSelect);

  const handleIconClick = (icon) => setSelectedIcon(icon);

  const handleShadowClick = ({ target }) => {
    if (target.classList.contains("shadow")) setShowIconSelect(false);
  };

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
        <IconSelect ref={shadow} className="shadow" onClick={handleShadowClick}>
          <div className="container">
            <button onClick={toggleShowIconSelect}>X</button>

            {icons.map((icon) => (
              <Icon
                onClick={() => handleIconClick(icon)}
                className={selectedIcon === icon ? "selected" : ""}
              >
                {icon}
              </Icon>
            ))}
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
  min-height: 100vh;
  background: ${({ theme }) => theme.opacityBackground};
  z-index: 99;

  .container {
    margin: 20vh auto 0;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 10px;
    background: ${({ theme }) => theme.background};
    max-width: 400px;
    width: 95%;
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
  }
`;

const Icon = styled.div`
  background: ${({ theme }) => theme.buttonMed};
  border: 3px solid ${({ theme }) => theme.buttonMed};
  height: 100px;
  width: 100px;
  margin: 1rem 0.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;

  &.selected {
    border: 3px solid ${({ theme }) => theme.border};
    box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
    transform: scale(1.1);
  }
`;
