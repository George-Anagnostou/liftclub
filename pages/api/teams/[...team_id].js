import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  const team_id = req.query.team_id[0];

  switch (httpMethod) {
    case "GET":
      const teamData = await db
        .collection("teams")
        .aggregate([
          { $match: { _id: ObjectId(team_id) } },
          {
            $lookup: {
              from: "routines",
              localField: "routine_id",
              foreignField: "_id",
              as: "routine",
            },
          },
          { $unwind: "$routine" },
          {
            $lookup: {
              from: "users",
              localField: "members",
              foreignField: "_id",
              as: "members",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "trainers",
              foreignField: "_id",
              as: "trainers",
            },
          },
        ])
        .toArray();

      res.json(teamData[0]);
      break;
    case "POST":
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
