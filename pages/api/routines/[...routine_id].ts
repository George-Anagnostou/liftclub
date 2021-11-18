import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../utils/mongodb";
import {
  deleteRoutine,
  getAggregatedRoutinesById,
  getRoutine,
  updateRoutine,
} from "../../../api-lib/mongo";
import { verifyAuthToken } from "../../../api-lib/auth/middleware";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();
  const { routine_id } = req.query;
  let validId: string | false;

  switch (httpMethod) {
    case "GET":
      const routines = await getAggregatedRoutinesById(db, routine_id.toString());
      res.json(routines[0]);
      break;
    case "POST":
      break;
    case "PUT":
      const { updatedRoutine } = JSON.parse(req.body); // no type

      validId = verifyAuthToken(req, updatedRoutine.creator_id);
      if (!validId) return res.redirect(401, "/");

      updatedRoutine.workoutPlan = updatedRoutine.workoutPlan.map((entry) => ({
        workout_id: new ObjectId(entry.workout_id),
        isoDate: new Date(entry.isoDate),
      }));
      updatedRoutine.creator_id = new ObjectId(updatedRoutine.creator_id);
      updatedRoutine._id = new ObjectId(updatedRoutine._id);

      const updated = await updateRoutine(db, updatedRoutine);
      updated ? res.status(204).end() : res.status(404).end();

      break;
    case "DELETE":
      const routine = await getRoutine(db, routine_id.toString());

      validId = verifyAuthToken(req, routine.creator_id);
      if (!validId) return res.redirect(401, "/");

      const deleted = await deleteRoutine(db, routine_id.toString());
      deleted ? res.status(204).end() : res.status(400).end();
      break;
  }
};
