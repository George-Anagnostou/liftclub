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

import { NewRoutine, Routine } from "../../types/interfaces";
import { ObjectId } from "mongodb";

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
  // TODO create a way to handle returning a routine that has workouts in
  // the workout plan that are no longer in the database
  return routines;
}
