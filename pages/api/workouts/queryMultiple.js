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

      const foundWorkouts = await db
        .collection("workouts")
        .find({
          _id: { $in: idArr.map((_id) => ObjectId(_id)) },
        })
        .toArray();
      res.json(foundWorkouts);
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};