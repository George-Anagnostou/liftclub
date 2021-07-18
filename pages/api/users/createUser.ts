import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import bcrypt from "bcryptjs";

const saltRounds = 10;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "POST") return res.status(405).end();

  // Hash password input
  const { username, password }: { username: string; password: string } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);

  const existingUser = await db.collection("users").findOne({ username: username });

  if (existingUser) {
    res.status(403).end();
  } else {
    const userData = await db.collection("users").insertOne({
      username: username,
      password: hash,
      savedWorkouts: [],
      workoutLog: [],
    });

    delete userData.ops[0].password;

    res.status(201).json(userData.ops[0]);
  }
};
