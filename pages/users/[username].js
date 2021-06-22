import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Utils
import { getUserFromUsername, getUserMadeWorkouts } from "../../utils/api";
// Context
import { useStoreState } from "../../store";
import { addFollow, removeFollow } from "../../store/actions/userActions";
// Components
import LoadingSpinner from "../../components/LoadingSpinner";
import ProfileImg from "../../components/userProfile/ProfileImg";
import Bio from "../../components/userProfile/Bio";

export default function User_id() {
  const router = useRouter();
  const { username } = router.query;
  const { user } = useStoreState();

  const [profileData, setProfileData] = useState(null);
  const [userIsFollowing, setUserIsFollowing] = useState(false);
  const [createdWorkouts, setCreatedWorkouts] = useState([]);
  const [isProfileOwner, setIsProfileOwner] = useState(false);

  const handleFollowClick = async () => {
    const success = await addFollow(user._id, profileData._id);

    if (success) {
      setUserIsFollowing(true);
      setProfileData((prev) => ({ ...prev, followers: [...prev.followers, user._id] }));
    }
  };

  const handleUnfollowClick = async () => {
    const success = await removeFollow(user._id, profileData._id);

    if (success) {
      setUserIsFollowing(false);
      setProfileData((prev) => ({
        ...prev,
        followers: prev.followers.filter((entry) => entry !== user._id),
      }));
    }
  };

  useEffect(() => {
    const getProfileData = async () => {
      const profile = await getUserFromUsername(username);

      setProfileData(profile);
      setIsProfileOwner(user._id === profile._id);
      setUserIsFollowing(user.following.includes(profile._id));

      const created = await getUserMadeWorkouts(profile._id);
      setCreatedWorkouts(created || []);
    };

    if (!profileData && username && user) getProfileData();
  }, [username, user]);

  return (
    <Container>
      {profileData && user ? (
        <>
          <HeaderTile>
            <div className="left">
              <ProfileImg profileData={profileData} isProfileOwner={isProfileOwner} />

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
              <p>{profileData.workoutLog.length} workouts logged</p>
              <p>{createdWorkouts.length} workouts built</p>
              <p>
                {profileData.followers?.length || 0}{" "}
                {profileData.followers?.length === 1 ? "follower" : "followers"}
              </p>
            </div>
          </HeaderTile>

          <Bio
            profileData={profileData}
            isProfileOwner={isProfileOwner}
            setProfileData={setProfileData}
            user_id={user._id}
          />
        </>
      ) : (
        <LoadingSpinner />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;

  & > * {
    margin-bottom: 0.5rem;
  }
`;

const HeaderTile = styled.header`
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

    h1 {
      margin-bottom: 0.5rem;
      letter-spacing: 1px;
      font-weight: 200;
    }
    p {
      margin: 0.25rem;
      color: ${({ theme }) => theme.textLight};
    }
  }
`;
