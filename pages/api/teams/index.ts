import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../utils/mongodb";
import { getTeamsByCreatorId, postTeam } from "../../../api-lib/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const creator_id = req.query.creator_id;
      if (!creator_id) res.status(404).end();

      const teams = await getTeamsByCreatorId(db, creator_id.toString());
      res.json(teams);

      break;
    case "POST":
      const team = JSON.parse(req.body);

      team.dateCreated = new Date(team.dateCreated);
      team.creator_id = new ObjectId(team.creator_id);
      team.trainers = team.trainers.map((_id: string) => new ObjectId(_id));
      team.routine_id = new ObjectId(team.routine_id);

      const insertedId = await postTeam(db, team);
      insertedId ? res.status(201).json(insertedId) : res.status(404).end();
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
