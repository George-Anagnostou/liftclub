import { useEffect, useState } from "react";
// Utils
import { addExerciseDataToWorkout } from "../../../utils";
// Context
import { useBuilderDispatch, useBuilderState, useUserState } from "../../../store";
import {
  getUserCreatedWorkouts,
  getUserSavedWorkouts,
} from "../../../store/actions/builderActions";
// Interfaces
import { Workout } from "../../../types/interfaces";
// Components
import DeleteWorkoutModal from "./DeleteWorkoutModal";
import TiledList from "../../Wrappers/TiledList";

interface Props {
  setCustomWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  customWorkout: Workout;
  clearCustomWorkout: () => void;
}

const UserWorkouts: React.FC<Props> = ({ setCustomWorkout, customWorkout, clearCustomWorkout }) => {
  const { user } = useUserState();
  const { workouts } = useBuilderState();
  const builderDispatch = useBuilderDispatch();

  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);

  const displayWorkout = async (workout: Workout) => {
    const mergedData = await addExerciseDataToWorkout(workout);

    if (mergedData.creator_id !== user!._id) {
      mergedData.numLogged = 0;
      mergedData.isPublic = false;
    }

    setCustomWorkout(mergedData);
  };

  useEffect(() => {
    if (user) {
      if (!workouts.created) getUserCreatedWorkouts(builderDispatch, user._id);
      if (!workouts.saved) getUserSavedWorkouts(builderDispatch, user.savedWorkouts || []);
    }
  }, [workouts, user]);

  return (
    <>
      <div className="tile">
        <h3>Created</h3>

        <TiledList
          items={workouts.created}
          onItemClick={(workout) => displayWorkout(workout)}
          displayProp="name"
          isHighlighted={(workout) => customWorkout._id === workout._id}
          onDeleteClick={(workout) => setWorkoutToDelete(workout)}
          keyProp="_id"
        />
      </div>

      <div className="tile">
        <h3>Saved</h3>

        <TiledList
          items={workouts.saved}
          onItemClick={(workout) => displayWorkout(workout)}
          displayProp="name"
          isHighlighted={(workout) => customWorkout._id === workout._id}
          keyProp="_id"
        />
      </div>

      {workoutToDelete && (
        <DeleteWorkoutModal
          workout={workoutToDelete}
          setWorkoutToDelete={setWorkoutToDelete}
          clearCustomWorkout={clearCustomWorkout}
        />
      )}
    </>
  );
};
export default UserWorkouts;
