import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { getShortUsersFromIdArr } from "../../../api-lib/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();
  if (httpMethod !== "POST") return res.status(405).end();

  const { idArr }: { idArr: string[] } = JSON.parse(req.body);

  const foundUsers = await getShortUsersFromIdArr(db, idArr);
  foundUsers.sort((a, b) => idArr.indexOf(a._id.toString()) - idArr.indexOf(b._id.toString()));

  res.json(foundUsers);
};
