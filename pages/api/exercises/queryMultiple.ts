import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { queryExercisesByIdArr } from "../../../api-lib/mongo/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "POST") return res.status(405).end();

  const idArr: string[] = JSON.parse(req.body);
  const exercises = await queryExercisesByIdArr(db, idArr);
  
  res.json(exercises);
};
