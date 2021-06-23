import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const { creator_id } = req.query;
      if (creator_id) req.query.creator_id = ObjectId(creator_id);

      const teams = await db.collection("teams").find(req.query).toArray();

      res.json(teams);

      break;
    case "POST":
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
