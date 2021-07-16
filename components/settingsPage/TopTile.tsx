import styled from "styled-components";
// Components
import ThemeToggle from "../Themes/ThemeToggle";
// Context
import { useStoreState } from "../../store";

const TopTile: React.FC = () => {
  const { user } = useStoreState();

  return (
    <Tile>
      <h3 className="title">Account</h3>

      <div className="info">
        <div className="row">
          <p>Status</p>
          <p>{user!.isTrainer ? "Trainer" : "Member"}</p>
        </div>

        <div className="row nightMode">
          <p>Night Mode</p>
          <span>
            <ThemeToggle />
          </span>
        </div>
      </div>

      <h3 className="title">Profile privacy</h3>

      <div className="info">
        <div className="row">
          <p>Days logged</p>
        </div>

        <div className="row">
          <p>Bio</p>
        </div>

        <div className="row">
          <p>Week history</p>
        </div>

        <div className="row">
          <p>Workout graph</p>
        </div>
      </div>
    </Tile>
  );
};
export default TopTile;

const Tile = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  text-align: left;

  .title {
    margin: 0.5rem 0;
    padding: 0 0.5rem 0.25rem;
  }

  .info {
    padding: 0 0.5rem;

    .row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.5rem 0.5rem;

      p {
        font-size: 1.2rem;
      }

      &:last-of-type {
        border-bottom: none;
      }

      &.nightMode {
        span {
          display: grid;
          place-items: center;
          margin-left: 1rem;
        }
      }
    }
  }
`;
