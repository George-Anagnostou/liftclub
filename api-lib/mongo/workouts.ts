import { NewWorkout, Workout } from "../../types/interfaces";
import { ObjectId } from "mongodb";

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

export async function incrementWorkoutNumLogged(db: any, workout_id: string) {
  const updated: boolean = await db
    .collection("workouts")
    .findOneAndUpdate({ _id: workout_id }, { $inc: { numLogged: 1 } });
  return updated;
}

export async function decrementWorkoutNumLogged(db: any, workout_id: string) {
  const updated: boolean = await db
    .collection("workouts")
    .findOneAndUpdate({ _id: new ObjectId(workout_id) }, { $inc: { numLogged: -1 } });
  return updated;
}
