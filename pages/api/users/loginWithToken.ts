import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "POST") return res.status(405).end();

  // Get a specific user from authToken

  const { token } = req.body;

  let verified: any;

  try {
    verified = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    res.status(400).end();
    return;
  }

  const userData = await db.collection("users").findOne({ _id: new ObjectId(verified.id) });

  if (userData) {
    db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(userData._id) },
      { $set: { lastLoggedIn: new Date().toISOString() } }
    );
    userData.lastLoggedIn = new Date().toISOString();
    delete userData.password;

    res.status(201).json(userData);
  } else {
    // Status 400 for bad password
    res.status(400).end();
    return;
  }
};
