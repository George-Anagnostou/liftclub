import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { User } from "../../../types/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "GET") return res.status(405).end();

  const query = req.query.query as string;

  const foundUsers: User[] = await db
    .collection("users")
    .aggregate([
      { $match: { username: { $regex: query, $options: "i" } } },
      {
        $project: {
          _id: 1,
          username: 1,
          profileImgUrl: 1,
          w: {
            $cond: [
              {
                $eq: [
                  { $substr: [{ $toLower: "$username" }, 0, query.length] },
                  query.toLocaleLowerCase(),
                ],
              },
              1,
              0,
            ],
          },
        },
      },
      { $sort: { w: -1 } },
    ])
    .toArray();

  res.json(foundUsers);
};
