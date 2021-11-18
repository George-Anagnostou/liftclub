import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../utils/mongodb";
import { verifyAuthToken } from "../../../api-lib/auth/middleware";
import { getAggregatedRoutinesById, postNewRoutine } from "../../../api-lib/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      if (typeof req.query.creator_id === "string") {
        const creator_id = req.query.creator_id;
        const routines = await getAggregatedRoutinesById(db, creator_id, "creator_id");
        res.json(routines);
      }
      break;
    case "POST":
      const { newRoutine } = JSON.parse(req.body); // no type

      const validId = verifyAuthToken(req, newRoutine.creator_id);
      if (!validId) return res.redirect(401, "/");

      newRoutine.workoutPlan = newRoutine.workoutPlan.map((entry) => ({
        workout_id: new ObjectId(entry.workout_id),
        isoDate: new Date(entry.isoDate),
      }));
      newRoutine.creator_id = new ObjectId(newRoutine.creator_id);
      newRoutine._id = new ObjectId(newRoutine._id);

      const insertedId = await postNewRoutine(db, newRoutine);
      insertedId ? res.status(201).json(insertedId) : res.status(404).end();

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
