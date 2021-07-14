import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      break;
    case "POST":
      const idArr: string[] = JSON.parse(req.body);

      const foundExercises = await db
        .collection("exercises")
        .find({
          _id: { $in: idArr.map((_id) => new ObjectId(_id)) },
        })
        .toArray();

      res.json(foundExercises);
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
