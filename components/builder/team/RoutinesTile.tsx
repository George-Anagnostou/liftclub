import React from "react";
// Context
import { useBuilderState } from "../../../store";
// Interfaces
import { Team, Routine } from "../../../types/interfaces";
// Components
import TiledList from "../../Wrappers/TiledList";

interface Props {
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team>>;
}
const RoutinesTile: React.FC<Props> = ({ team, setTeam }) => {
  const { routines } = useBuilderState();

  const handleRoutineClick = (routine: Routine) => {
    setTeam({ ...team, routine_id: routine._id });
  };

  return (
    <div className="tile">
      <h3>Your Routines</h3>

      <TiledList
        items={routines.created}
        onItemClick={(routine) => handleRoutineClick(routine)}
        displayProp="name"
        isHighlighted={(routineItem) => team.routine_id === routineItem._id}
        keyProp="_id"
      />
    </div>
  );
};

export default RoutinesTile;
