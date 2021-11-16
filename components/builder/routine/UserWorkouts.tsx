// Context
import { useBuilderState } from "../../../store";
// Interfaces
import { Workout, Routine } from "../../../types/interfaces";
// Components
import TiledList from "../../Wrappers/TiledList";

interface Props {
  selectedDaysFromPlan: Routine["workoutPlan"];
  addWorkoutToDatesSelected: (workout: Workout) => void;
}

const UserWorkouts: React.FC<Props> = ({ selectedDaysFromPlan, addWorkoutToDatesSelected }) => {
  const { workouts } = useBuilderState();

  return (
    <>
      <div className="tile">
        <h3>Created</h3>

        <TiledList
          items={workouts.created}
          onItemClick={(workout) => addWorkoutToDatesSelected(workout)}
          displayProp="name"
          isHighlighted={(workout) =>
            Boolean(selectedDaysFromPlan.filter((day) => day.workout_id === workout._id).length)
          }
          keyProp="_id"
        />
      </div>

      <div className="tile">
        <h3>Saved</h3>

        <TiledList
          items={workouts.saved}
          onItemClick={(workout) => addWorkoutToDatesSelected(workout)}
          displayProp="name"
          isHighlighted={(workout) =>
            Boolean(selectedDaysFromPlan.filter((day) => day.workout_id === workout._id).length)
          }
          keyProp="_id"
        />
      </div>
    </>
  );
};
export default UserWorkouts;
