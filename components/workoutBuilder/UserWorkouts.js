import styled from "styled-components";

export default function UserWorkouts({
  userWorkouts,
  displaySavedWorkout,
  customWorkoutName,
  publicWorkouts,
}) {
  return (
    <UserWorkoutsContainer>
      <ul>
        <h3>Your Workouts</h3>
        {userWorkouts.map((each, i) => (
          <li
            key={i}
            onClick={() => displaySavedWorkout(each)}
            style={customWorkoutName === each.name ? { background: "rgb(215, 221, 247)" } : {}}
          >
            {each.name}
          </li>
        ))}
      </ul>

      <ul>
        <h3>Public Workouts</h3>
        {publicWorkouts.map((each, i) => (
          <li
            key={i}
            onClick={() => displaySavedWorkout(each)}
            style={customWorkoutName === each.name ? { background: "rgb(215, 221, 247)" } : {}}
          >
            {each.name}
          </li>
        ))}
      </ul>
    </UserWorkoutsContainer>
  );
}

const UserWorkoutsContainer = styled.div`
  text-align: center;
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  width: 15%;
  margin: 0.5rem 0;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  ul {
    width: 100%;

    li {
      border: none;
      border-radius: 5px;
      box-shadow: 0 0 5px grey;

      cursor: pointer;
      padding: 0.5rem;
      margin: 1rem;
      text-align: center;
      text-transform: capitalize;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;

      &:hover {
        background: #c9c9c9;
      }
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
  }
`;
