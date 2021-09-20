import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";
import { ShortUser } from "../../../utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "POST") return res.status(405).end();

  const { idArr }: { idArr: string[] } = JSON.parse(req.body);

  const foundUsers: ShortUser[] = await db
    .collection("users")
    .find({ _id: { $in: idArr.map((_id) => new ObjectId(_id)) } })
    .project({ username: 1, profileImgUrl: 1 })
    .toArray();

  foundUsers.sort((a, b) => idArr.indexOf(a._id.toString()) - idArr.indexOf(b._id.toString()));

  res.json(foundUsers);
};
