import type { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../../utils/mongodb";
import { getUserByUsername, postNewUser } from "../../../api-lib/mongo";

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

  const existingUser = await getUserByUsername(db, username);

  if (existingUser) {
    // Username already exists in DB
    res.status(403).end();
  } else {
    const userData = await postNewUser(db, username, hash);
    const token = jwt.sign({ id: userData._id }, JWT_SECRET);
    res.status(201).json({ userData, token });
  }
};
