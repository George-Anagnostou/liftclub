import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "../../../utils/mongodb";
import {
  deleteExercise,
  getDefaultExercises,
  postNewExercise,
  queryExercises,
} from "../../../api-lib/mongo";
import { verifyAuthToken } from "../../../api-lib/auth/middleware";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      if (typeof req.query.creator_id === "string") {
        const exercises = await queryExercises(db, {
          creator_id: new ObjectId(req.query.creator_id),
        });
        res.json(exercises);
      } else {
        const exercises = await getDefaultExercises(db);
        res.json(exercises);
      }
      res.status(400).end();
      break;
    case "POST":
      const exercise = JSON.parse(req.body); // no type
      exercise.creator_id = new ObjectId(exercise.creator_id);

      const validId = verifyAuthToken(req, exercise.creator_id);
      if (!validId) return res.redirect(401, "/");

      const insertedId = await postNewExercise(db, exercise);
      insertedId ? res.status(201).end() : res.status(404).end();

      break;
    case "PUT":
      break;
    case "DELETE":
      const exercise_id = req.query.exercise_id.toString();
      const [exerciseToDelete] = await queryExercises(db, { _id: new ObjectId(exercise_id) });

      if (exerciseToDelete) {
        const validId = verifyAuthToken(req, exerciseToDelete.creator_id);
        if (!validId) return res.redirect(401, "/");

        const deleted = await deleteExercise(db, exercise_id);
        deleted ? res.status(204).end() : res.status(404).end();
      }
      break;
  }
};
