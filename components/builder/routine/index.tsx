import React, { useState, useEffect } from "react";
import { daysBetween } from "../../../utils";
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
    setUndoRoutineStack([]);
  };

  const addRoutineToUndo = () => {
    setUndoRoutineStack([routine, ...undoRoutineStack]);
  };

  // Take off the top of undo stack and set it to current routine
  const undoRoutine = () => {
    const [undo, ...rest] = undoRoutineStack;
    if (!undo) return;

    setRoutine(undo);

    setUndoRoutineStack(rest);
  };

  const deleteWorkoutsOnSelectedDates = () => {
    if (selectedDaysFromPlan.length === 0) return;

    addRoutineToUndo();

    setRoutine((prev) => ({
      ...prev,
      workoutPlan: [
        ...prev.workoutPlan.filter((each) => !datesSelected[each.isoDate.substring(0, 10)]),
      ],
    }));
  };

  const addWorkoutToDatesSelected = (workout: Workout) => {
    addRoutineToUndo();

    const plan = Object.keys(datesSelected).map((date) => ({
      isoDate: date,
      workout_id: workout._id,
      workout,
    }));

    setRoutine((prev) => ({
      ...prev,
      workoutPlan: [
        ...prev.workoutPlan.filter((planDay) => !datesSelected[planDay.isoDate.substring(0, 10)]),
        ...plan,
      ].sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
    }));
  };

  const copyWorkoutsToStartDate = (startDate: string) => {
    if (selectedDaysFromPlan.length === 0) return;

    addRoutineToUndo();

    const newDatesMap = new Map();
    newDatesMap.set(startDate, true);

    // Construct an array of the new workouts to add to the plan
    const newDates: Routine["workoutPlan"] = [
      {
        isoDate: startDate,
        workout_id: selectedDaysFromPlan[0].workout_id,
        workout: selectedDaysFromPlan[0].workout,
      },
    ];

    for (let i = 1; i < selectedDaysFromPlan.length; i++) {
      // Create date object from previous new date
      const date = new Date(newDates[i - 1].isoDate);
      // Increment days from the previous date
      date.setDate(
        date.getDate() +
          daysBetween(selectedDaysFromPlan[i - 1].isoDate, selectedDaysFromPlan[i].isoDate)
      );
      const newDate = date.toISOString().substring(0, 10);

      newDatesMap.set(newDate, true);

      // Add to new dates array
      newDates.push({
        isoDate: newDate,
        workout_id: selectedDaysFromPlan[i].workout_id,
        workout: selectedDaysFromPlan[i].workout,
      });
    }

    // Filter out any overlapping dates and insert the new dates
    setRoutine((prev) => ({
      ...prev,
      workoutPlan: [
        ...prev.workoutPlan.filter((planDay) => !newDatesMap.get(planDay.isoDate.substring(0, 10))),
        ...newDates,
      ].sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
    }));
  };

  return (
    <>
      <ControlsBar routine={routine} setRoutine={setRoutine} clearRoutine={clearRoutine} />

      <UserRoutines routine={routine} setRoutine={setRoutine} clearRoutine={clearRoutine} />

      <Calendar
        data={formatRoutineWorkoutPlanForCalendar(routine.workoutPlan)}
        setDatesSelected={setDatesSelected}
        datesSelected={datesSelected}
        deleteWorkoutsOnSelectedDates={deleteWorkoutsOnSelectedDates}
        undoRoutineStack={undoRoutineStack}
        undoRoutine={undoRoutine}
        selectedDaysFromPlan={selectedDaysFromPlan}
        copyWorkoutsToStartDate={copyWorkoutsToStartDate}
      />

      <UserWorkouts
        selectedDaysFromPlan={selectedDaysFromPlan}
        addWorkoutToDatesSelected={addWorkoutToDatesSelected}
      />
    </>
  );
};
export default RoutineBuilder;
