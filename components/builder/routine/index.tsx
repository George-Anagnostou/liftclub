import React, { useState, useEffect } from "react";
// Utils
import { formatRoutineWorkoutPlanForCalendar } from "../../../utils/dataMutators";
// Interfaces
import { Routine, Workout } from "../../../utils/interfaces";
// Components
import Calendar from "./Calendar";
import ControlsBar from "./ControlsBar";
import UserRoutines from "./UserRoutines";
import UserWorkouts from "./UserWorkouts";

const initialRoutineState = { _id: "", creator_id: "", creatorName: "", name: "", workoutPlan: [] };

const RoutineBuilder: React.FC = () => {
  const [routine, setRoutine] = useState<Routine>(initialRoutineState);
  const [selectedDaysFromPlan, setSelectedDaysFromPlan] = useState<Routine["workoutPlan"]>([]);
  const [routineSaved, setRoutineSaved] = useState<null | boolean>(null);
  const [datesSelected, setDatesSelected] = useState<{ [date: string]: boolean }>({});
  const [undoRoutineStack, setUndoRoutineStack] = useState<Routine[]>([]);

  useEffect(() => {
    const workoutsSelected = routine.workoutPlan.filter(
      (workout) => datesSelected[workout.isoDate.substring(0, 10)]
    );
    setSelectedDaysFromPlan(workoutsSelected);
  }, [datesSelected, routine]);

  const clearRoutine = () => {
    setRoutine(initialRoutineState);
  };

  const addCurrentRoutineToUndo = () => {
    setUndoRoutineStack((prev) => [routine, ...prev]);
  };

  // Take off the top of undo stack and set it to current routine
  const undoRoutine = () => {
    const [undo, ...rest] = undoRoutineStack;
    if (!undo) return;

    setRoutine(undo);

    setUndoRoutineStack(rest);
  };

  const deleteWorkoutsOnSelectedDates = () => {
    addCurrentRoutineToUndo();

    setRoutine((prev) => ({
      ...prev,
      workoutPlan: [
        ...prev.workoutPlan.filter((each) => !datesSelected[each.isoDate.substring(0, 10)]),
      ],
    }));
  };

  const addWorkoutToDatesSelected = (workout: Workout) => {
    addCurrentRoutineToUndo();

    const plan = Object.keys(datesSelected).map((date) => {
      return { isoDate: date, workout_id: workout._id, workout };
    });

    setRoutine((prev) => ({
      ...prev,
      workoutPlan: [
        ...prev.workoutPlan.filter((each) => !datesSelected[each.isoDate.substring(0, 10)]),
        ...plan,
      ].sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
    }));
  };

  return (
    <>
      <ControlsBar
        routine={routine}
        setRoutine={setRoutine}
        clearRoutine={clearRoutine}
        routineSaved={routineSaved}
        setRoutineSaved={setRoutineSaved}
      />

      <UserRoutines
        clearRoutine={clearRoutine}
        setRoutine={setRoutine}
        routine={routine}
        routineSaved={routineSaved}
      />

      <Calendar
        data={formatRoutineWorkoutPlanForCalendar(routine.workoutPlan)}
        setDatesSelected={setDatesSelected}
        datesSelected={datesSelected}
        deleteWorkoutsOnSelectedDates={deleteWorkoutsOnSelectedDates}
        undoRoutineStack={undoRoutineStack}
        undoRoutine={undoRoutine}
      />

      <UserWorkouts
        selectedDaysFromPlan={selectedDaysFromPlan}
        addWorkoutToDatesSelected={addWorkoutToDatesSelected}
      />
    </>
  );
};
export default RoutineBuilder;
