import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";
import { Workout } from "../../../utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      break;
    case "POST":
      const idArr = JSON.parse(req.body);

      const foundWorkouts: Workout[] = await db
        .collection("workouts")
        .find({
          _id: { $in: idArr.map((_id) => new ObjectId(_id)) },
        })
        .toArray();

      res.json(foundWorkouts);
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
