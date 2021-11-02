import React from "react";
// Context
import { useBuilderState } from "../../../store";
// Interfaces
import { Routine } from "../../../utils/interfaces";
import { EditableTeam } from "./index";
// Components
import TiledList from "../../Wrappers/TiledList";

interface Props {
  team: EditableTeam;
  setTeam: React.Dispatch<React.SetStateAction<EditableTeam>>;
}
const RoutinesTile: React.FC<Props> = ({ team, setTeam }) => {
  const { routines } = useBuilderState();

  const handleRoutineClick = (routine: Routine) => {
    setTeam({ ...team, routine: routine, routine_id: routine._id });
  };

  return (
    <div className="tile">
      <h3>Your Routines</h3>

      <TiledList
        items={routines.created}
        onItemClick={(routine) => handleRoutineClick(routine)}
        displayProp="name"
        isHighlighted={(routineItem) => team.routine?._id === routineItem._id}
        keyProp="_id"
      />
    </div>
  );
};

export default RoutinesTile;
