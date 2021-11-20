import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { queryExercisesByIdArr } from "../../../api-lib/mongo";
import { Exercise } from "../../../types/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "POST") return res.status(405).end();

  const idArr: string[] = JSON.parse(req.body);
  const exercises = await queryExercisesByIdArr(db, idArr);
  // Sort exercises to be in the same order that the irArr requests them
  exercises.sort(
    (a: Exercise, b: Exercise) => idArr.indexOf(a._id.toString()) - idArr.indexOf(b._id.toString())
  );
  res.json(exercises);
};
