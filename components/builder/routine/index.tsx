import React, { useState, useEffect } from "react";
// Utils
import { areTheSameDate } from "../../../utils";
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [routineSaved, setRoutineSaved] = useState<null | boolean>(null);

  // Set selected workout when selectedDate or routine changes
  useEffect(() => {
    const foundWorkout = routine.workoutPlan.filter((workout) =>
      areTheSameDate(workout.isoDate, selectedDate)
    )[0]?.workout;

    setSelectedWorkout(foundWorkout || null);
  }, [selectedDate, routine]);

  const clearRoutine = () => {
    setRoutine(initialRoutineState);
  };

  return (
    <>
      <ControlsBar
        clearRoutine={clearRoutine}
        setRoutine={setRoutine}
        routine={routine}
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
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedWorkout={selectedWorkout}
      />

      <UserWorkouts
        routine={routine}
        setRoutine={setRoutine}
        selectedDate={selectedDate}
        selectedWorkout={selectedWorkout}
      />
    </>
  );
};
export default RoutineBuilder;
