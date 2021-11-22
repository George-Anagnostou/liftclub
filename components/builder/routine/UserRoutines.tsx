import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// Context
import { useBuilderDispatch, useBuilderState, useUserState } from "../../../store";
import { getUserCreatedRoutines } from "../../../store/actions/builderActions";
// Interfaces
import { Routine } from "../../../types/interfaces";
// Components
import DeleteRoutineModal from "./DeleteRoutineModal";
import TiledList from "../../Wrappers/TiledList";

interface Props {
  routine: Routine;
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
  clearRoutine: () => void;
}

const UserRoutines: React.FC<Props> = ({ routine, setRoutine, clearRoutine }) => {
  const { user } = useUserState();
  const { routines } = useBuilderState();
  const builderDispatch = useBuilderDispatch();

  const router = useRouter();

  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);
  const [hasQueriedUrl, setHasQueriedUrl] = useState(false);

  // Set routines created on mount
  useEffect(() => {
    if (user && !routines.created) getUserCreatedRoutines(builderDispatch, user._id);
  }, [user]);

  // If url has query for specific routine, set that routine
  useEffect(() => {
    const queriedRoutine_id = router.query.routine as string;

    if (queriedRoutine_id && routines.created && !hasQueriedUrl) {
      const queried = routines.created.find((each) => each._id === queriedRoutine_id);

      if (queried) setRoutine(queried);
      setHasQueriedUrl(true);
    }
  }, [routines.created]);

  return (
    <>
      {routineToDelete && (
        <DeleteRoutineModal
          routine={routineToDelete}
          setRoutineToDelete={setRoutineToDelete}
          clearRoutine={clearRoutine}
        />
      )}

      <div className="tile">
        <h3>My Routines</h3>

        <TiledList
          items={routines.created}
          onItemClick={(routine) => setRoutine(routine)}
          displayProp="name"
          isHighlighted={(routineItem) => routine._id === routineItem._id}
          onDeleteClick={(routine) => setRoutineToDelete(routine)}
          keyProp="_id"
        />
      </div>
    </>
  );
};

export default UserRoutines;
