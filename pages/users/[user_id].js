import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styled from "styled-components";
// Utils
import { getUserData } from "../../utils/api";
// Components
import LoadingSpinner from "../../components/LoadingSpinner";
// Context
import { useStoreState } from "../../store";

export default function User_id() {
  const router = useRouter();
  const { user_id } = router.query;
  const { user } = useStoreState();

  const [userData, setUserData] = useState(null);
  const [canEditPage, setCanEditPage] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const data = await getUserData(user_id);
      setUserData(data);
      setCanEditPage(user._id === data._id);
    };

    if (user_id) getData();
  }, [user_id]);

  return (
    <Container>
      {userData ? (
        <>
          <Header>
            <div className="left">
              <ProfileImage>
                {userData.profileImg ? (
                  <Image src="/favicon.jpeg" height="100" width="100"></Image>
                ) : (
                  <div className="addImgIcon">
                    <span></span>
                    <span></span>
                    <p>ADD IMAGE</p>
                  </div>
                )}
              </ProfileImage>
            </div>
            <div className="right">
              <h1>{userData.username}</h1>
              <p>{userData.workoutLog.length} logged lifts</p>
              <p>0 followers</p>
            </div>

            {canEditPage && <EditBtn>Edit</EditBtn>}
          </Header>

          <Bio>
            <h3>Bio</h3>
            <p>{userData.bio || "User bio here."}</p>

            {canEditPage && <EditBtn>Edit</EditBtn>}
          </Bio>
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
  min-height: 100vh;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;

  & > * {
    margin-bottom: 0.5rem;
  }
`;

const Header = styled.header`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.background};
  display: flex;
  padding: 1rem 0.5rem;
  border-radius: 10px;

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

const ProfileImage = styled.div`
  border-radius: 50%;
  height: 100px;
  width: 100px;
  background: ${({ theme }) => theme.buttonMed};
  overflow: hidden;

  .addImgIcon {
    height: 100%;
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

const Bio = styled.section`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 1rem 1rem;
  border-radius: 10px;
  text-align: left;

  h3 {
    font-weight: 100;
    letter-spacing: 1px;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;

const EditBtn = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.buttonMed};
`;
