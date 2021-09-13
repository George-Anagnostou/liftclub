import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      if (typeof req.query.creator_id === "string") {
        const query = { creator_id: new ObjectId(req.query.creator_id) };

        const routines = await db
          .collection("routines")
          .aggregate([
            { $match: query },
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

        res.json(routines);
        break;
      }

      break;
    case "POST":
      const { newRoutine } = JSON.parse(req.body);

      newRoutine.workoutPlan.map((entry) => {
        entry.workout_id = new ObjectId(entry.workout_id);
        entry.isoDate = new Date(entry.isoDate);
      });
      newRoutine.creator_id = new ObjectId(newRoutine.creator_id);
      newRoutine._id = new ObjectId(newRoutine._id);

      const { insertedId } = await db.collection("routines").insertOne(newRoutine);

      insertedId ? res.status(201).json(insertedId) : res.status(404).end();

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
