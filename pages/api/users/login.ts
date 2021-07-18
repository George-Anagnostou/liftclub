import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../utils/interfaces";
import { connectToDatabase } from "../../../utils/mongodb";
import bcrypt from "bcryptjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "POST") return res.status(405).end();

  const { username, password }: { username: string; password: string } = req.body;

  // Get user from db with username they entered
  const user: User | null = await db.collection("users").findOne({ username: String(username) });

  if (user && user.password) {
    // Validate password entered with user.password retrieved from db
    const validLogin = bcrypt.compareSync(String(password), user.password);

    delete user.password;

    validLogin ? res.status(201).json(user) : res.status(400).end(); // Status 400 for bad password
  } else {
    // Status 401 for bad username
    res.status(401).end();
  }
};
