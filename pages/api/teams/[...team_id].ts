import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";
// Interfaces
import { Team } from "../../../utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  const team_id = req.query.team_id[0];
  let teamData: Team;

  switch (httpMethod) {
    case "GET":
      teamData = await db
        .collection("teams")
        .aggregate([
          { $match: { _id: new ObjectId(team_id) } },
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
              localField: "trainers",
              foreignField: "_id",
              as: "trainers",
            },
          },
          {
            $project: {
              _id: 1,
              teamName: 1,
              members: 1,
              dateCreated: 1,
              creatorName: 1,
              creator_id: 1,
              routine_id: 1,
              routine: 1,
              "trainers._id": 1,
              "trainers.username": 1,
              "trainers.profileImgUrl": 1,
            },
          },
        ])
        .toArray();

      res.json(teamData[0]);
      break;
    case "POST":
      break;
    case "PUT":
      let fieldToUpdate = "";

      const { addTrainer } = req.query;
      if (addTrainer) fieldToUpdate = "ADD_TRAINER";

      const { removeTrainer } = req.query;
      if (removeTrainer) fieldToUpdate = "REMOVE_TRAINER";

      switch (fieldToUpdate) {
        case "ADD_TRAINER":
          teamData = await db
            .collection("teams")
            .findOneAndUpdate(
              { _id: new ObjectId(team_id) },
              { $push: { trainers: new ObjectId(addTrainer.toString()) } },
              { returnNewDocument: true }
            );

          res.json({});
          break;
        case "REMOVE_TRAINER":
          teamData = await db
            .collection("teams")
            .findOneAndUpdate(
              { _id: new ObjectId(team_id) },
              { $pull: { trainers: new ObjectId(removeTrainer.toString()) } },
              { returnNewDocument: true }
            );

          res.json({});
          break;
      }
      break;
    case "DELETE":
      break;
  }
};
