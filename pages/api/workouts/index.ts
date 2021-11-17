import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../utils/mongodb";
import { Workout } from "../../../types/interfaces";
import { verifyAuthToken } from "../../../api-lib/auth/middleware";
import {
  findPublicWorkouts,
  queryWorkoutsByCreatorId,
  postNewWorkout,
} from "../../../api-lib/mongo/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      let workouts: Workout[] = [];

      let QUERY = "";

      const creator_id = req.query.creator_id as string;
      if (creator_id) QUERY = "CREATOR_ID";

      const isPublic = req.query.isPublic as string;
      if (isPublic) QUERY = "IS_PUBLIC";

      switch (QUERY) {
        case "CREATOR_ID":
          workouts = await queryWorkoutsByCreatorId(db, creator_id as string);
          break;
        case "IS_PUBLIC":
          workouts = await findPublicWorkouts(db);
          break;
        default:
          throw new Error("Invalid query to workouts GET api");
      }
      res.json(workouts);

      break;
    case "POST":
      const newWorkout = JSON.parse(req.body);

      const validId = verifyAuthToken(req, newWorkout.creator_id);
      if (!validId) return res.redirect(401, "/");

      // Cast all string ids to ObjectIds
      newWorkout.date_created = new Date(newWorkout.date_created);
      newWorkout.creator_id = new ObjectId(newWorkout.creator_id);
      newWorkout.exercises.map((each) => (each.exercise_id = new ObjectId(each.exercise_id)));

      const insertedId = await postNewWorkout(db, newWorkout);

      insertedId ? res.status(201).json(insertedId) : res.status(404).end();

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
