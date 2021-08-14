import React, { useState, useEffect } from "react";
import styled from "styled-components";
// Context
import { stripTimeAndCompareDates } from "../../../utils";
// Interfaces
import { Routine, Workout } from "../../../utils/interfaces";
// Components
import Calendar from "../../teamPage/Calendar";
import ControlsBar from "./ControlsBar";
import DateData from "./DateData";
import UserRoutines from "./UserRoutines";
import UserWorkouts from "./UserWorkouts";

const initialRoutineState = { _id: "", creator_id: "", creatorName: "", name: "", workoutPlan: [] };

const RoutineBuilder: React.FC = () => {
  const [routine, setRoutine] = useState<Routine>(initialRoutineState);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const foundWorkout = routine.workoutPlan.filter((workout) =>
      stripTimeAndCompareDates(workout.isoDate, selectedDate)
    )[0]?.workout;

    setSelectedWorkout(foundWorkout || null);
  }, [selectedDate, routine]);

  return (
    <>
      <ControlsBar
        initialRoutineState={initialRoutineState}
        setRoutine={setRoutine}
        routine={routine}
      />

      <UserRoutines setRoutine={setRoutine} routine={routine} />

      <DateData selectedDate={selectedDate} selectedWorkout={selectedWorkout} />
      <Calendar
        data={routine.workoutPlan}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
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
