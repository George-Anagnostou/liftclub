import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { User } from "../../../utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "GET") return res.status(405).end();

  const query = req.query.query as string;

  const foundUsers: User[] = await db
    .collection("users")
    .find(
      { username: { $regex: query, $options: "i" } },
      { projection: { _id: 1, username: 1, profileImgUrl: 1 } }
    )
    .toArray();

  res.json(foundUsers);
};
