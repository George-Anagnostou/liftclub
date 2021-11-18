import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { queryWorkoutsByIdArr } from "../../../api-lib/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      break;
    case "POST":
      const idArr: string[] = JSON.parse(req.body);
      const workouts = await queryWorkoutsByIdArr(db, idArr);
      res.json(workouts);
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
