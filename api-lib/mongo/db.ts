import { NewWorkout, dbExercise, dbWorkout, Exercise } from "../../types/interfaces";
import { ObjectId } from "mongodb";

// Workouts

export async function queryWorkoutsByCreatorId(db: any, creator_id: string) {
  const workouts = await db
    .collection("workouts")
    .find({ creator_id: new ObjectId(creator_id.toString()) })
    .toArray();
  return workouts;
}

export async function findPublicWorkouts(db: any) {
  const workouts = await db.collection("workouts").find({ isPublic: true }).toArray();
  return workouts;
}

export async function postNewWorkout(db: any, workout: NewWorkout) {
  const { insertedId } = await db.collection("workouts").insertOne(workout);
  return insertedId;
}

export async function updateWorkout(db: any, workout: dbWorkout) {
  const updated = await db.collection("workouts").replaceOne({ _id: workout._id }, workout);
  return updated;
}

export async function getWorkout(db: any, id: string) {
  const workout = await db.collection("workouts").findOne({ _id: new ObjectId(id) });
  return workout;
}

export async function deleteWorkout(db: any, id: string) {
  const deleted = await db.collection("workouts").deleteOne({ _id: new ObjectId(id) });
  return Boolean(deleted.deletedCount);
}

// User

export async function getUser(db: any, id: string) {
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
  return user;
}

export async function updateUserLastLoggedIn(db: any, id: string) {
  db.collection("users").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { lastLoggedIn: new Date().toISOString() } }
  );
}

// Exercises

export async function queryExercises(db: any, query) {
  const exercises = await db.collection("exercises").find(query).toArray();
  return exercises;
}

export async function postNewExercise(db: any, exercise: dbExercise) {
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
