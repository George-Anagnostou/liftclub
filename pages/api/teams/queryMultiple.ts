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

      const foundTeams = await db
        .collection("teams")
        .aggregate([
          { $match: { _id: { $in: idArr.map((_id) => new ObjectId(_id)) } } },
          {
            $lookup: {
              from: "routines",
              localField: "routine_id",
              foreignField: "_id",
              as: "routine",
            },
          },
          { $unwind: "$routine" },
        ])
        .toArray();

      res.json(foundTeams);
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
