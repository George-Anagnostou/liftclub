export type User = {
  readonly _id: string;
  readonly username: string;
  savedWorkouts?: Array<string>;
  workoutLog: WorkoutLog;
  weight?: Array<number>;
  following?: Array<string>;
  followers?: Array<string>;
  bio?: string;
  isTrainer?: boolean;
  teamsJoined?: Array<string>;
  settings?: { showBio: boolean };
  profileImgUrl?: string;
  password?: string;
};

export interface WorkoutLog {
  [isoDate: string]: WorkoutLogItem;
}

export interface WorkoutLogItem {
  completed: boolean;
  exerciseData: {
    exercise_id: string;
    sets: { reps: number; weight: number | string }[];
    exercise?: Exercise;
  }[];
  workoutNote: string;
  workout_id: string;
  workout?: Workout;
  isoDate?: string;
}

export interface Team {
  readonly _id: string;
  teamName: string;
  members: string[];
  dateCreated: string;
  creatorName: string;
  creator_id: string;
  trainers: { _id: string; username: string; profileImgUrl: string | undefined }[];
  routine_id: string;
  routine: Routine;
}

export interface Routine {
  readonly _id: string;
  creator_id: string;
  creatorName: string;
  name: string;
  workoutPlan: { isoDate: string; workout_id: string; workout: Workout }[];
}

export interface RoutineWorkoutPlanForCalendar {
  [isoDate: string]: { workout_id: string; workout: Workout };
}

export interface Workout {
  readonly _id: string;
  creator_id: string;
  creatorName: string;
  name: string;
  exercises: {
    exercise_id: string;
    sets: { reps: number; weight: number }[];
    exercise?: Exercise;
  }[];
  isPublic: boolean;
  date_created: string;
  numLogged: number;
}

export interface NewWorkout {
  creator_id: string;
  creatorName: string;
  name: string;
  exercises: {
    exercise_id: string;
    sets: { reps: number; weight: number }[];
    exercise?: Exercise;
  }[];
  isPublic: boolean;
  date_created: string;
}

export interface Exercise {
  readonly _id: string;
  name: string;
  equipment: string;
  muscleGroup: string;
  muscleWorked: string;
}

export interface NewExercise {
  name: string;
  equipment: string;
  muscleGroup: string;
  muscleWorked: string;
}
