import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectID } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "POST") return res.status(405).end();

  // Get a specific user from _id

  const { user_id } = req.body;

  const userData = await db.collection("users").findOne({ _id: new ObjectID(user_id) });

  if (userData) {
    delete userData.password;
    res.status(201).json(userData);
  } else {
    // Status 400 for bad password
    res.status(400).end();
  }
};
