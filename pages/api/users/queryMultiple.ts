import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";
import { User } from "../../../utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      break;
    case "POST":
      const { idArr }: { idArr: string[] } = JSON.parse(req.body);

      const foundUsers: User[] = await db
        .collection("users")
        .find({
          _id: { $in: idArr.map((_id) => new ObjectId(_id)) },
        })
        .toArray();

      foundUsers.map((each) => delete each.password);

      res.json(foundUsers);
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
