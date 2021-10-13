import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../utils/interfaces";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

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

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    if (validLogin && token) {
      db.collection("users").findOneAndUpdate(
        { _id: new ObjectId(user._id) },
        { $set: { lastLoggedIn: new Date().toISOString() } }
      );

      user.lastLoggedIn = new Date().toISOString();

      res.status(201).json({ userData: user, token: token });
    } else {
      res.status(400).end();
    }
  } else {
    // Status 401 for bad username
    res.status(401).end();
  }
};
