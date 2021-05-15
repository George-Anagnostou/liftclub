import { useEffect, useState } from "react";
import styled from "styled-components";

import PublicWorkoutTile from "./PublicWorkoutTile";
import SearchIcon from "./SearchIcon";

export default function PublicWorkouts({
  workouts,
  workoutIsSaved,
  removeFromSavedWorkouts,
  addToSavedWorkouts,
}) {
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    if (workouts.length) {
      const lowercasedFilter = filter.toLowerCase();

      const filteredData = workouts.filter((workout) => {
        return workout.name.toLowerCase().includes(lowercasedFilter);
      });

      setFilteredWorkouts(filteredData);
    }
  }, [filter, workouts]);

  return (
    <WorkoutList>
      <div className="searchContainer">
        <div className="searchBar">
          <SearchIcon />
          <input type="text" name="filter" onChange={handleFilterChange} value={filter} />
        </div>
        <button onClick={() => setFilter("")}>Cancel</button>
      </div>

      <h3 className="listTitle">Public Workouts</h3>

      {filteredWorkouts.map((workout) => (
        <PublicWorkoutTile
          key={`public${workout._id}`}
          workout={workout}
          workoutIsSaved={workoutIsSaved}
          removeFromSavedWorkouts={removeFromSavedWorkouts}
          addToSavedWorkouts={addToSavedWorkouts}
        />
      ))}
    </WorkoutList>
  );
}

const WorkoutList = styled.ul`
  width: 100%;

  .searchContainer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    color: #575757;
    fill: #575757;
    font-size: 1.2rem;

    .searchBar {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #eee;
      width: fit-content;
      margin: 0.5rem;
      padding: 0 1rem;
      border-radius: 10px;

      input {
        border: none;
        outline: none;
        padding: 0.5rem 0 0.5rem 0.5rem;
        font-size: inherit;
        background: inherit;
        color: inherit;
      }
    }

    button {
      border: none;
      padding: 0.5rem;
      font-size: inherit;
      background: inherit;
      color: inherit;
    }
  }

  .listTitle {
    margin-left: 1.5rem;
    text-align: left;
    color: #ccc;
    font-weight: 400;
  }
`;
