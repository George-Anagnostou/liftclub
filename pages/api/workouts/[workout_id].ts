import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";
import { Workout } from "../../../types/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  const { workout_id } = req.query;

  switch (httpMethod) {
    case "GET":
      const workoutData: Workout = await db
        .collection("workouts")
        .findOne({ _id: new ObjectId(workout_id.toString()) });

      res.json(workoutData);

      break;
    case "POST":
      break;
    case "PUT":
      const updatedWorkout = JSON.parse(req.body);
      // Cast all string ids to ObjectIds
      updatedWorkout._id = new ObjectId(updatedWorkout._id);
      updatedWorkout.creator_id = new ObjectId(updatedWorkout.creator_id);
      updatedWorkout.exercises.map((each) => (each.exercise_id = new ObjectId(each.exercise_id)));

      const updated = await db
        .collection("workouts")
        .replaceOne({ _id: updatedWorkout._id }, updatedWorkout);

      updated ? res.status(204).end() : res.status(404).end();

      break;
    case "DELETE":
      const deleted = await db
        .collection("workouts")
        .deleteOne({ _id: new ObjectId(workout_id.toString()) });

      deleted.deletedCount ? res.status(204).end() : res.status(400).end();

      break;
  }
};
