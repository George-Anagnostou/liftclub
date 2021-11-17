import {
  NewWorkout,
  Exercise,
  Workout,
  User,
  NewExercise,
  NewRoutine,
  Routine,
} from "../../types/interfaces";
import { ObjectId } from "mongodb";

// Workouts

export async function queryWorkoutsByIdArr(db: any, idArr: string[]) {
  const workouts: Workout[] = await db
    .collection("workouts")
    .find({
      _id: { $in: idArr.map((_id) => new ObjectId(_id)) },
    })
    .toArray();
  return workouts;
}

export async function queryWorkoutsByCreatorId(db: any, creator_id: string) {
  const workouts: Workout[] = await db
    .collection("workouts")
    .find({ creator_id: new ObjectId(creator_id.toString()) })
    .toArray();
  return workouts;
}

export async function findPublicWorkouts(db: any) {
  const workouts: Workout[] = await db.collection("workouts").find({ isPublic: true }).toArray();
  return workouts;
}

export async function postNewWorkout(db: any, workout: NewWorkout) {
  const { insertedId } = await db.collection("workouts").insertOne(workout);
  return insertedId as string;
}

export async function updateWorkout(db: any, workout: Workout) {
  const updated: boolean = await db
    .collection("workouts")
    .replaceOne({ _id: workout._id }, workout);
  return updated;
}

export async function getWorkout(db: any, id: string) {
  const workout: Workout = await db.collection("workouts").findOne({ _id: new ObjectId(id) });
  return workout;
}

export async function deleteWorkout(db: any, id: string) {
  const deleted = await db.collection("workouts").deleteOne({ _id: new ObjectId(id) });
  return Boolean(deleted.deletedCount);
}

// Users

export async function getUser(db: any, id: string) {
  const user: User = await db.collection("users").findOne({ _id: new ObjectId(id) });
  return user;
}

export async function updateUserLastLoggedIn(db: any, id: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { lastLoggedIn: new Date().toISOString() } }
    );
  return updated;
}

// Exercises

export async function queryExercises(db: any, query) {
  const exercises: Exercise[] = await db.collection("exercises").find(query).toArray();
  return exercises;
}

export async function postNewExercise(db: any, exercise: NewExercise) {
  const { insertedId } = await db.collection("exercises").insertOne(exercise);
  return insertedId as string;
}

export async function queryExercisesByIdArr(db: any, idArr: string[]) {
  const exercises: Exercise[] = await db
    .collection("exercises")
    .find({
      _id: { $in: idArr.map((_id) => new ObjectId(_id)) },
    })
    .toArray();
  return exercises;
}

// Routines

export async function postNewRoutine(db: any, routine: NewRoutine) {
  const { insertedId } = await db.collection("routines").insertOne(routine);
  return insertedId as string;
}

export async function updateRoutine(db: any, routine: Routine) {
  const updated: boolean = await db
    .collection("routines")
    .replaceOne({ _id: new ObjectId(routine._id) }, routine);
  return updated;
}

export async function deleteRoutine(db: any, id: string) {
  const deleted = await db.collection("routines").deleteOne({ _id: new ObjectId(id) });
  return Boolean(deleted.deletedCount);
}

export async function getRoutine(db: any, id: string) {
  const routine: Routine = await db.collection("routines").findOne({ _id: new ObjectId(id) });
  return routine;
}

export async function getAggregatedRoutinesById(
  db: any,
  id: string,
  property: "_id" | "creator_id" = "_id"
) {
  const routines: Routine[] = await db
    .collection("routines")
    .aggregate([
      { $match: { [property]: new ObjectId(id) } },
      { $unwind: { path: "$workoutPlan" } },
      {
        $lookup: {
          from: "workouts",
          localField: "workoutPlan.workout_id",
          foreignField: "_id",
          as: "workoutPlan.workout",
        },
      },
      { $unwind: { path: "$workoutPlan.workout" } },
      {
        $group: {
          _id: "$_id",
          root: { $mergeObjects: "$$ROOT" },
          workoutPlan: { $push: "$workoutPlan" },
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: ["$root", "$$ROOT"] } } },
      { $project: { root: 0 } },
    ])
    .toArray();

  console.log(routines);
  return routines;
}
