import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";
import { Workout } from "../../../utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      let QUERY = "";
      let workouts: Workout[] = [];

      let { creator_id } = req.query;
      if (creator_id) QUERY = "CREATOR_ID";
      let { isPublic } = req.query;
      if (isPublic) QUERY = "IS_PUBLIC";

      switch (QUERY) {
        case "CREATOR_ID":
          workouts = await db
            .collection("workouts")
            .find({ creator_id: new ObjectId(creator_id.toString()) })
            .toArray();
          break;
        case "IS_PUBLIC":
          workouts = await db
            .collection("workouts")
            .find({ isPublic: Boolean(isPublic) })
            .toArray();
          break;
        default:
          throw new Error("not a valid query to workouts GET API");
      }

      res.json(workouts);
      break;
    case "POST":
      const newWorkout = JSON.parse(req.body);

      // Cast all string ids to ObjectIds
      newWorkout.date_created = new Date(newWorkout.date_created);
      newWorkout.creator_id = new ObjectId(newWorkout.creator_id);
      newWorkout.exercises.map((each) => (each.exercise_id = new ObjectId(each.exercise_id)));

      const added = await db.collection("workouts").insertOne(newWorkout);

      added.insertedId ? res.status(201).end() : res.status(404).end();

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
