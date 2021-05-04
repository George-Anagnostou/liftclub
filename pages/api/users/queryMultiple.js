import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      break;
    case "POST":
      const idArr = JSON.parse(req.body);

      const foundUsers = await db
        .collection("users")
        .find({
          _id: { $in: idArr.map((_id) => ObjectId(_id)) },
        })
        .toArray();

      res.json(foundUsers);
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
