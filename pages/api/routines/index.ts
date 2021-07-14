import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const routines = await db.collection("routines").find(req.query).toArray();
      res.json(routines);
      break;
    case "POST":
      const { newRoutine } = JSON.parse(req.body);

      newRoutine.workoutPlan.map((entry) => {
        entry.workout_id = new ObjectId(entry.workout_id);
        entry.isoDate = new Date(entry.isoDate);
      });
      newRoutine.creator_id = new ObjectId(newRoutine.creator_id);
      newRoutine._id = new ObjectId(newRoutine._id);

      const added = await db.collection("routines").insertOne(newRoutine);

      added.insertedId ? res.status(201).end() : res.status(404).end();

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
