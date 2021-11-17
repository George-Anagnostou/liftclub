import { ObjectId } from "bson";

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

export interface Team {
  _id: string;
  teamName: string;
  members: string[];
  dateCreated: string;
  creatorName: string;
  creator_id: string;
  trainers: ShortUser[];
  routine_id: string;
  routine: Routine;
}

export interface Routine {
  _id: string;
  creator_id: string;
  creatorName: string;
  name: string;
  workoutPlan: { isoDate: string; workout_id: string; workout: Workout }[];
}

export interface NewRoutine {
  creator_id: string;
  creatorName: string;
  name: string;
  workoutPlan: { isoDate: string; workout_id: string }[];
}

export interface RoutineWorkoutPlanForCalendar {
  [isoDate: string]: { workout_id: string; workout: Workout };
}

//  Workout
interface BaseWorkout {
  creatorName: string;
  name: string;
  isPublic: boolean;
  date_created: string;
  numLogged: number;
}
export interface Workout extends BaseWorkout {
  readonly _id: string;
  creator_id: string;
  exercises: {
    exercise_id: string;
    sets: { reps: number; weight: number }[];
    exercise?: Exercise;
  }[];
}
export interface NewWorkout extends BaseWorkout {
  creator_id: string;
  exercises: {
    exercise_id: string;
    sets: { reps: number; weight: number }[];
    exercise?: Exercise;
  }[];
}
export interface dbWorkout extends BaseWorkout {
  _id?: ObjectId;
  creator_id: ObjectId;
  exercises: {
    exercise_id: ObjectId;
    sets: { reps: number; weight: number }[];
    exercise?: Exercise;
  }[];
}

// Exercise
interface BaseExercise {
  name: string;
  equipment: string;
  muscleGroup: string;
  muscleWorked: string;
  metric: string;
}
export interface Exercise extends BaseExercise {
  readonly _id: string;
}
export interface NewExercise extends BaseExercise {
  creator_id: string;
}
export interface dbExercise extends BaseExercise {
  creator_id: ObjectId;
}
