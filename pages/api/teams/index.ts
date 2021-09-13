import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const creator_id = req.query.creator_id as string;
      if (!creator_id) res.status(404).end();

      const teams = await db
        .collection("teams")
        .find({ creator_id: new ObjectId(creator_id) })
        .toArray();
      res.json(teams);

      break;
    case "POST":
      const team = JSON.parse(req.body);

      team.dateCreated = new Date(team.dateCreated);
      team.creator_id = new ObjectId(team.creator_id);
      team.trainers = team.trainers.map((_id: string) => new ObjectId(_id));
      team.members = team.members.map((_id: string) => new ObjectId(_id));
      team.routine_id = new ObjectId(team.routine_id);

      const { insertedId } = await db.collection("teams").insertOne(team);

      db.collection("users").findOneAndUpdate(
        { _id: new ObjectId(team.creator_id) },
        { $push: { teamsJoined: insertedId } }
      );

      insertedId ? res.status(201).end() : res.status(404).end();

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
