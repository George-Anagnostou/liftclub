import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";
// Interfaces
import { Team } from "../../../types/interfaces";

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

      const { updateTeam } = req.query;
      if (updateTeam) fieldToUpdate = "UPDATE_TEAM";

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

        case "UPDATE_TEAM":
          const team = JSON.parse(req.body);

          team._id = new ObjectId(team._id);
          team.members = team.members.map((mem: string) => new ObjectId(mem));
          team.dateCreated = new Date(team.dateCreated);
          team.creator_id = new ObjectId(team.creator_id);
          team.trainers = team.trainers.map((_id: string) => new ObjectId(_id));
          team.routine_id = new ObjectId(team.routine_id);

          const updated = await db
            .collection("teams")
            .replaceOne({ _id: new ObjectId(team_id) }, team);

          updated ? res.status(204).end() : res.status(404).end();
          break;
        default:
          break;
      }
      break;
    case "DELETE":
      const deleted = await db.collection("teams").deleteOne({ _id: new ObjectId(team_id) });

      deleted.deletedCount ? res.status(204).end() : res.status(400).end();
      break;
  }
};
