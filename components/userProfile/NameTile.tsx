import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// Context
import { useStoreState } from "../../store";
// API
import { addFollow, removeFollow } from "../../utils/api";
// Components
import ProfileImg from "./ProfileImg";
import Settings from "../../public/navIcons/Settings";
// Interfaces
import { User } from "../../utils/interfaces";
import FollowsModal from "./FollowsModal";

interface Props {
  profileData: User;
  setProfileData: React.Dispatch<React.SetStateAction<User | null>>;
  isProfileOwner: boolean;
}

const NameTile: React.FC<Props> = ({ profileData, setProfileData, isProfileOwner }) => {
  const { user } = useStoreState();

  const [userIsFollowing, setUserIsFollowing] = useState(false);
  const [showFollowsModal, setShowFollowsModal] = useState(false);
  const [modalData, setModalData] = useState<string[]>([]);

  const handleFollowClick = async () => {
    const success = await addFollow(user!._id, profileData._id);

    if (success) {
      setUserIsFollowing(true);
      setProfileData((prev: User) => ({
        ...prev,
        followers: [...(prev.followers || []), user!._id],
      }));
    }
  };

  const handleUnfollowClick = async () => {
    const success = await removeFollow(user!._id, profileData._id);

    if (success) {
      setUserIsFollowing(false);
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

  useEffect(() => {
    if (user) setUserIsFollowing(user.following?.includes(profileData._id) || false);
  }, [user]);

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

        {!isProfileOwner && (
          <button
            className={userIsFollowing ? "unfollowBtn" : "followBtn"}
            onClick={userIsFollowing ? handleUnfollowClick : handleFollowClick}
          >
            {userIsFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      <div className="right">
        <h1>{profileData.username}</h1>
        <p>{profileData.workoutLog.length} days logged</p>
        <p onClick={() => handleProfileFollowsClick("followers")}>
          {profileData.followers?.length || 0}{" "}
          {profileData.followers?.length === 1 ? "follower" : "followers"}
        </p>
        <p onClick={() => handleProfileFollowsClick("following")}>
          {profileData.following?.length || 0} following{" "}
        </p>
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
    .followBtn {
      margin-top: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      border-radius: 5px;
      color: ${({ theme }) => theme.accentText};
      background: ${({ theme }) => theme.accent};
      border: 1px solid ${({ theme }) => theme.accentSoft};
    }
    .unfollowBtn {
      margin-top: 0.5rem;
      padding: 0.5rem 0.5rem;
      font-size: 1rem;
      border-radius: 5px;
      color: ${({ theme }) => theme.textLight};
      background: ${({ theme }) => theme.buttonMed};
      border: 1px solid ${({ theme }) => theme.buttonLight};
    }
  }

  .right {
    margin-left: 0.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;

    h1 {
      margin-bottom: 0.5rem;
      letter-spacing: 1px;
      font-weight: 200;
      min-width: max-content;
    }
    p {
      margin: 0.25rem;
      color: ${({ theme }) => theme.textLight};
    }
  }
`;

const SettingsIcon = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;

  fill: ${({ theme }) => theme.text};
`;
