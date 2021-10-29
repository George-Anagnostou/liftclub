import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import WorkoutControls from "../../../../components/builder/workout/ControlsBar";
import { Workout } from "../../../../utils/interfaces";

const MockNewCustomWorkout: Workout = {
  _id: "",
  creator_id: "",
  creatorName: "",
  name: "",
  exercises: [
    {
      exercise_id: "",
      sets: [{ reps: 10, weight: 100 }],
      exercise: {
        _id: "",
        name: "cable rows",
        equipment: "cable machine",
        muscleGroup: "upper back",
        muscleWorked: "trapezius",
      },
    },
  ],
  isPublic: false,
  date_created: "",
  numLogged: 0,
};

describe("Custom Workout Controls", () => {
  test("should be able to accept user input for workout name", async () => {
    const handleWorkoutNameChange = jest.fn();
    const handlePrivacyChange = jest.fn();

    render(
      <WorkoutControls
        customWorkout={MockNewCustomWorkout}
        saveCustomWorkout={jest.fn()}
        clearCustomWorkout={jest.fn()}
        handleWorkoutNameChange={handleWorkoutNameChange}
        handlePrivacyChange={handlePrivacyChange}
      />
    );

    const inputElement = screen.getByPlaceholderText("Name your workout");
    expect(inputElement).toBeInTheDocument();
    userEvent.type(inputElement, "My Workout 1");
    expect(handleWorkoutNameChange).toHaveBeenCalledTimes(12);
  });

  test("should save workout when save button is clicked", () => {
    const saveCustomWorkout = jest.fn();

    render(
      <WorkoutControls
        customWorkout={MockNewCustomWorkout}
        saveCustomWorkout={saveCustomWorkout}
        clearCustomWorkout={jest.fn()}
        handleWorkoutNameChange={jest.fn()}
        handlePrivacyChange={jest.fn()}
      />
    );

    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeInTheDocument();

    waitFor(() => userEvent.click(saveButton));

    expect(saveCustomWorkout).toHaveBeenCalledTimes(1);
  });

  test("should clear custom workout when clear button is clicked", () => {
    const clearCustomWorkout = jest.fn();

    render(
      <WorkoutControls
        customWorkout={MockNewCustomWorkout}
        saveCustomWorkout={jest.fn()}
        clearCustomWorkout={clearCustomWorkout}
        handleWorkoutNameChange={jest.fn()}
        handlePrivacyChange={jest.fn()}
      />
    );

    const clearButton = screen.getByText("Clear");
    expect(clearButton).toBeInTheDocument();

    waitFor(() => userEvent.click(clearButton));

    expect(clearCustomWorkout).toHaveBeenCalledTimes(1);
  });
});
