import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Utils
import { getUserFromUsername, getUserMadeWorkouts } from "../../utils/api";
// Context
import { useStoreState } from "../../store";
// Components
import LoadingSpinner from "../../components/LoadingSpinner";
import NameTile from "../../components/userProfile/NameTile";
import Bio from "../../components/userProfile/Bio";
import WeeklyBar from "../../components/userProfile/WeeklyBar";
import Teams from "../../components/userProfile/Teams";
// Interfaces
import { User, Workout } from "../../utils/interfaces";

const User_id: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const { user } = useStoreState();

  const [profileData, setProfileData] = useState<User | null>(null);
  const [createdWorkouts, setCreatedWorkouts] = useState<Workout[]>([]);
  const [isProfileOwner, setIsProfileOwner] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      if (typeof username !== "string") return;

      const profile = await getUserFromUsername(username);

      if (profile) {
        setProfileData(profile);
        setIsProfileOwner(user!._id === profile._id);

        const created = await getUserMadeWorkouts(profile._id);
        setCreatedWorkouts(created || []);
      }
    };

    if (username && user) getProfileData();
  }, [username, user, router]);

  return (
    <Container>
      {profileData && user ? (
        <>
          <NameTile
            profileData={profileData}
            setProfileData={setProfileData}
            isProfileOwner={isProfileOwner}
          />

          <Bio
            profileData={profileData}
            isProfileOwner={isProfileOwner}
            setProfileData={setProfileData}
            user_id={user._id}
          />

          <WeeklyBar profileData={profileData} />

          <Teams profileData={profileData} isProfileOwner={isProfileOwner} />
        </>
      ) : (
        <div className="loadingContainer">
          <LoadingSpinner />
        </div>
      )}
    </Container>
  );
};
export default User_id;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;

  & > * {
    margin-bottom: 0.5rem;
  }

  .title {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 300;
    font-size: 1rem;
  }

  .loadingContainer {
    height: 100vh;
    display: grid;
    place-items: center;
  }
`;