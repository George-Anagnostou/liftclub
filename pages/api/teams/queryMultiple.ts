import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const sortMethod = req.query.sort;

      if (sortMethod === "members") {
        const teams = await db
          .collection("teams")
          .aggregate([
            { $addFields: { membersCount: { $size: { $ifNull: ["$members", []] } } } },
            { $sort: { membersCount: -1 } },
          ])
          .toArray();

        res.json(teams);
      } else {
        res.status(404).end();
      }
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
