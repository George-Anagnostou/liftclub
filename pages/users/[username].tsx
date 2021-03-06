import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Utils
import {
  getTeamsFromIdArray,
  getUserFromUsername,
  getUserMadeWorkouts,
} from "../../api-lib/fetchers";
// Context
import { useUserState } from "../../store";
// Components
import LoadingSpinner from "../../components/LoadingSpinner";
import NameTile from "../../components/userProfile/NameTile";
import Bio from "../../components/userProfile/Bio";
import WeeklyBar from "../../components/userProfile/WeeklyBar";
import TeamsTile from "../../components/userProfile/TeamsTile";
import CreatedWorkoutsTile from "../../components/userProfile/CreatedWorkoutsTile";
import ProgressTile from "../../components/userProfile/ProgressTile";
// Interfaces
import { User, Workout, Team } from "../../types/interfaces";
import SeoHead from "../../components/SeoHead";

const User_id: React.FC = () => {
  const router = useRouter();
  const username: string = router.query.username as string;
  const { user, isSignedIn } = useUserState();

  const [profileData, setProfileData] = useState<User | null>(null);
  const [createdWorkouts, setCreatedWorkouts] = useState<Workout[]>([]);
  const [profileTeamsJoined, setProfileTeamsJoined] = useState<Team[]>([]);
  const [isProfileOwner, setIsProfileOwner] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const getProfileData = async () => {
      const profile = await getUserFromUsername(username);

      if (profile) {
        setProfileData(profile);
        setIsProfileOwner(user!._id === profile._id);

        const created = await getUserMadeWorkouts(profile._id);
        setCreatedWorkouts(created || []);

        const teamsRes = await getTeamsFromIdArray(profile.teamsJoined || []);
        setProfileTeamsJoined(teamsRes || []);
      }

      setLoadingPage(false);
    };

    if (username && isSignedIn) getProfileData();
  }, [isSignedIn, username]);

  return (
    <Container>
      {!loadingPage && profileData && user ? (
        <>
          <SeoHead title={`${profileData.username}'s profile - Lift Club`} />

          <NameTile
            profileData={profileData}
            setProfileData={setProfileData}
            isProfileOwner={isProfileOwner}
          />

          <WeeklyBar profileData={profileData} />

          <Bio
            profileData={profileData}
            isProfileOwner={isProfileOwner}
            setProfileData={setProfileData}
            user_id={user._id}
          />

          <ProgressTile profileData={profileData} />

          <TeamsTile profileTeamsJoined={profileTeamsJoined} profile_id={profileData._id} />

          <CreatedWorkoutsTile createdWorkouts={createdWorkouts} />
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
    margin-bottom: 0.5rem 0.25rem 0.75rem;
    font-weight: 200;
    font-size: 1rem;
  }

  .loadingContainer {
    height: 80vh;
    display: grid;
    place-items: center;
  }
`;
