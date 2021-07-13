import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const { creator_id } = req.query;
      if (!creator_id) res.status(404).end();

      const teams = await db
        .collection("teams")
        .find({ creator_id: new ObjectId(creator_id.toString()) })
        .toArray();
      res.json(teams);

      break;
    case "POST":
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
