import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { searchUsernameQuery } from "../../../api-lib/mongo/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "GET") return res.status(405).end();

  const query = req.query.query.toString();
  const foundUsers = await searchUsernameQuery(db, query);

  res.json(foundUsers);
};
