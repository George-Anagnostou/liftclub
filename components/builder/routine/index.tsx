import React, { useState, useEffect } from "react";
// Utils
import { formatRoutineWorkoutPlanForCalendar } from "../../../utils/dataMutators";
// Interfaces
import { Routine } from "../../../utils/interfaces";
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

  useEffect(() => {
    const workoutsSelected = routine.workoutPlan.filter(
      (workout) => datesSelected[workout.isoDate.substring(0, 10)]
    );

    setSelectedDaysFromPlan(workoutsSelected);
  }, [datesSelected, routine]);

  const clearRoutine = () => {
    setRoutine(initialRoutineState);
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
      />

      <UserWorkouts
        setRoutine={setRoutine}
        selectedDaysFromPlan={selectedDaysFromPlan}
        datesSelected={datesSelected}
      />
    </>
  );
};
export default RoutineBuilder;
