import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  // Require that fetch method be POST
  if (httpMethod !== "POST") return res.status(405).end();

  // Hash password input
  const { username, password }: { username: string; password: string } = req.body;
  const hash = bcrypt.hashSync(password, SALT_ROUNDS);

  const existingUser = await db.collection("users").findOne({ username: username });

  if (existingUser) {
    // Username already exists in DB
    res.status(403).end();
  } else {
    const userData = await db.collection("users").insertOne({
      username: username,
      password: hash,
      savedWorkouts: [],
      workoutLog: {},
      accountCreated: new Date().toISOString(),
      lastLoggedIn: new Date().toISOString(),
    });

    delete userData.ops[0].password;

    const token = jwt.sign({ id: userData._id }, JWT_SECRET);

    res.status(201).json({ userData: userData.ops[0], token: token });
  }
};
