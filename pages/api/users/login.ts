import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../utils/interfaces";
import { connectToDatabase } from "../../../utils/mongodb";
import bcrypt from "bcryptjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      break;
    case "POST":
      const { username, password }: { username: string; password: string } = req.body;
      // Get user from db with username they entered
      const user: User | null = await db.collection("users").findOne({ username: username });

      if (user && user.password) {
        // Validate password entered with user.password retrieved from db
        const validLogin = bcrypt.compareSync(password, user.password);

        delete user.password;

        validLogin ? res.json(user) : res.status(400).end();
      } else {
        res.status(401).end();
      }

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};