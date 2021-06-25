import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  const team_id = req.query.team_id[0];
  let teamData;

  switch (httpMethod) {
    case "GET":
      teamData = await db
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
      let fieldToUpdate;

      const { addTrainer } = req.query;
      if (addTrainer) fieldToUpdate = "ADD_TRAINER";

      const { removeTrainer } = req.query;
      if (removeTrainer) fieldToUpdate = "REMOVE_TRAINER";

      switch (fieldToUpdate) {
        case "ADD_TRAINER":
          teamData = await db
            .collection("teams")
            .findOneAndUpdate(
              { _id: ObjectId(team_id) },
              { $push: { trainers: ObjectId(addTrainer) } },
              { returnNewDocument: true }
            );

          res.json({});
          break;
        case "REMOVE_TRAINER":
          teamData = await db
            .collection("teams")
            .findOneAndUpdate(
              { _id: ObjectId(team_id) },
              { $pull: { trainers: ObjectId(removeTrainer) } },
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
