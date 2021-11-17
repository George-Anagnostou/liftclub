import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import {
  getAllTeamsWithRoutineDataByTeamIdArr,
  queryAllTeamsByMemberCount,
} from "../../../api-lib/mongo/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const sortMethod = req.query.sort;
      if (sortMethod === "members") {
        const teams = await queryAllTeamsByMemberCount(db);
        res.json(teams);
      }

      res.status(404).end();

      break;
    case "POST":
      const idArr: string[] = JSON.parse(req.body);
      const foundTeams = await getAllTeamsWithRoutineDataByTeamIdArr(db, idArr);
      res.json(foundTeams);
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
