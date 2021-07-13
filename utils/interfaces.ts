export interface User {
  _id: string;
  username: string;
  savedWorkouts?: Array<string>;
  workoutLog: WorkoutLog;
  weight?: Array<number>;
  following?: Array<string>;
  followers?: Array<string>;
  bio?: string;
  isTrainer?: boolean;
  teamsJoined?: Array<string>;
  settings?: { showBio: boolean };
  profileImg?: number;
}

export interface Workout {
  _id: string;
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

export type WorkoutLog = WorkoutLogItem[];

export interface WorkoutLogItem {
  isoDate: string;
  completed: boolean;
  workoutName: string;
  workout_id: string;
  workoutNote: string;
  exerciseData: {
    exercise_id: string;
    sets: { reps: number; weight: number | string }[];
    exercise?: Exercise;
  }[];
}

export interface Team {
  _id: string;
  teamName: string;
  members: Array<string>;
  dateCreated: string;
  creatorName: string;
  creator_id: string;
  trainers: Array<string>;
  routine_id: string;
  routineName?: string;
  routine?: Routine;
}

export interface Routine {
  _id: string;
  creator_id: string;
  creatorName: string;
  name: string;
  workoutPlan: { isoDate: string; workout_id: string }[];
}

export interface Exercise {
  _id: string;
  name: string;
  equipment: string;
  muscleGroup: string;
  muscleWorked: string;
}
