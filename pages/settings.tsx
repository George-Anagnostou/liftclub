import styled from "styled-components";
import { useRouter } from "next/router";
// Components
import LoadingSpinner from "../components/LoadingSpinner";
import WeightInput from "../components/settingsPage/WeightInput";
import TopTile from "../components/settingsPage/TopTile";
// Context
import { useStoreState, useStoreDispatch, logoutUser } from "../store";

export default function settings() {
  const dispatch = useStoreDispatch();
  const { user } = useStoreState();
  const router = useRouter();

  const handleLogoutClick = () => {
    logoutUser(dispatch);
    router.push("/");
  };

  return (
    <Container>
      {user ? (
        <>
          <TopTile />

          <WeightInput />

          <LogoutBtn onClick={handleLogoutClick}>sign out</LogoutBtn>
        </>
      ) : (
        <div className="loadingContainer">
          <LoadingSpinner />
        </div>
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

  .loadingContainer {
    height: 100vh;
    display: grid;
    place-items: center;
  }

  .title {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 300;
    font-size: 1rem;
  }
`;

const LogoutBtn = styled.button`
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: inherit;
  border: none;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.background};
`;
