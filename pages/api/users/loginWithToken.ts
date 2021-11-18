import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { verifyAuthToken } from "../../../api-lib/auth/middleware";
import { getUserById, updateUserLastLoggedIn } from "../../../api-lib/mongo/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "POST") return res.status(405).end();

  // Get a specific user from authToken
  let validId = verifyAuthToken(req);
  if (!validId) return res.status(401).end();

  const userData = await getUserById(db, validId);

  if (userData) {
    updateUserLastLoggedIn(db, userData._id);
    userData.lastLoggedIn = new Date().toISOString();
    delete userData.password;

    res.status(201).json(userData);
  } else {
    res.status(400).end();
    return;
  }
};
