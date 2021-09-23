import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// Context
import { useStoreDispatch, useStoreState } from "../../store";
import { addUserFollow, removeUserFollow } from "../../store/actions/userActions";
// Components
import ProfileImg from "./ProfileImg";
import Settings from "../svg/Settings";
import FollowsModal from "./FollowsModal";
// Interfaces
import { User } from "../../utils/interfaces";

interface Props {
  profileData: User;
  setProfileData: React.Dispatch<React.SetStateAction<User | null>>;
  isProfileOwner: boolean;
}

const NameTile: React.FC<Props> = ({ profileData, setProfileData, isProfileOwner }) => {
  const { user } = useStoreState();
  const dispatch = useStoreDispatch();

  const [showFollowsModal, setShowFollowsModal] = useState(false);
  const [modalData, setModalData] = useState<string[]>([]);

  const handleFollowClick = async () => {
    const success = await addUserFollow(dispatch, user!._id, profileData._id);

    if (success) {
      setProfileData((prev: User) => ({
        ...prev,
        followers: [...(prev.followers || []), user!._id],
      }));
    }
  };

  const handleUnfollowClick = async () => {
    const success = await removeUserFollow(dispatch, user!._id, profileData._id);

    if (success) {
      setProfileData((prev: User) => ({
        ...prev,
        followers: prev.followers?.filter((entry) => entry !== user!._id) || [],
      }));
    }
  };

  const handleProfileFollowsClick = (type: "following" | "followers") => {
    setShowFollowsModal(true);
    setModalData(profileData[type] || []);
  };

  return (
    <TileContainer>
      {isProfileOwner && (
        <Link href="/settings">
          <SettingsIcon>
            <Settings />
          </SettingsIcon>
        </Link>
      )}

      <div className="left">
        <ProfileImg
          profileData={profileData}
          setProfileData={setProfileData}
          isProfileOwner={isProfileOwner}
        />

        {!isProfileOwner &&
          (user!.following?.includes(profileData._id) || false ? (
            <button className={"unfollowBtn"} onClick={handleUnfollowClick}>
              Following
            </button>
          ) : (
            <button className={"followBtn"} onClick={handleFollowClick}>
              Follow
            </button>
          ))}
      </div>

      <div className="right">
        <h1>{profileData.username}</h1>

        <p>
          {Object.keys(profileData.workoutLog).length} <span>days logged</span>
        </p>

        <div className="follows">
          <p onClick={() => handleProfileFollowsClick("followers")}>
            {profileData.followers?.length || 0}{" "}
            <span>{profileData.followers?.length === 1 ? "follower" : "followers"}</span>
          </p>

          <p onClick={() => handleProfileFollowsClick("following")}>
            {profileData.following?.length || 0} <span>following</span>
          </p>
        </div>
      </div>

      {showFollowsModal && (
        <FollowsModal
          member_ids={modalData}
          setShowFollowsModal={setShowFollowsModal}
          showFollowsModal={showFollowsModal}
        />
      )}
    </TileContainer>
  );
};
export default NameTile;

const TileContainer = styled.header`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.background};
  display: flex;
  padding: 1rem 0.5rem;
  border-radius: 10px;

  .left {
    button {
      margin-top: 0.5rem;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      border-radius: 5px;
      border: none;
    }
    .followBtn {
      color: ${({ theme }) => theme.accentText};
      background: ${({ theme }) => theme.accent};
    }
    .unfollowBtn {
      color: ${({ theme }) => theme.textLight};
      background: ${({ theme }) => theme.buttonMed};
    }
  }

  .right {
    margin-left: 0.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    overflow: hidden;

    h1 {
      font-weight: 300;
      min-width: max-content;
    }

    p {
      margin: 0.1rem 0;
      font-size: 0.9rem;
      color: ${({ theme }) => theme.textLight};
      span {
        font-size: 0.7rem;
      }
    }

    .follows {
      display: flex;

      p:last-child {
        margin-left: 0.5rem;
      }
    }
  }
`;

const SettingsIcon = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;

  fill: ${({ theme }) => theme.text};
`;
