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
  recentlyViewedUsers?: string[];
  lastLoggedIn: string;
  accountCreated: string;
};

export interface ShortUser {
  readonly _id: string;
  readonly username: string;
  profileImgUrl: string | undefined;
}

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

// Team
export interface NewTeam {
  teamName: string;
  members: string[];
  dateCreated: string;
  creatorName: string;
  creator_id: string;
  trainers: ShortUser[];
  routine_id: string;
}
export interface Team extends NewTeam {
  readonly _id: string;
  routine: Routine;
}

// Routine
export interface NewRoutine {
  creatorName: string;
  name: string;
  creator_id: string;
  workoutPlan: { isoDate: string; workout_id: string }[];
}
export interface Routine extends NewRoutine {
  readonly _id: string;
  workoutPlan: { isoDate: string; workout_id: string; workout: Workout }[];
}

export interface RoutineWorkoutPlanForCalendar {
  [isoDate: string]: { workout_id: string; workout: Workout };
}

//  Workout
export interface NewWorkout {
  creatorName: string;
  name: string;
  isPublic: boolean;
  numLogged: number;
  creator_id: string;
  exercises: {
    exercise_id: string;
    sets: { reps: number; weight: number }[];
    exercise?: Exercise;
  }[];
  date_created: string;
}
export interface Workout extends NewWorkout {
  readonly _id: string;
}

// Exercise
export interface NewExercise {
  name: string;
  equipment: string;
  muscleGroup: string;
  muscleWorked: string;
  metric: string;
  creator_id: string;
  isDefault: boolean;
}
export interface Exercise extends NewExercise {
  readonly _id: string;
}
