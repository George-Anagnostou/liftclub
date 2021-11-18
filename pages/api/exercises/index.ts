import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "../../../utils/mongodb";
import { postNewExercise, queryExercises } from "../../../api-lib/mongo";
import { verifyAuthToken } from "../../../api-lib/auth/middleware";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const exercises = await queryExercises(db, req.query);
      res.json(exercises);
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
      break;
  }
};
