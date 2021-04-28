import { connectToDatabase } from "../../../utils/mongodb";

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const exercises = await db.collection("exercises").find(req.query).toArray();
      res.json(exercises);
      break;
    case "POST":
      const exercise = JSON.parse(req.body);

      const added = await db.collection("exercises").insertOne(exercise);

      added.insertedId ? res.status(201).end() : res.status(404).end();

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
