import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const { creator_id } = req.query;
      const { isPublic } = req.query;
      if (creator_id) req.query.creator_id = ObjectId(creator_id);
      if (isPublic) req.query.isPublic = Boolean(isPublic);

      const workouts = await db.collection("workouts").find(req.query).toArray();
      res.json(workouts);
      break;
    case "POST":
      const newWorkout = JSON.parse(req.body);

      // Cast all string ids to ObjectIds
      newWorkout.date_created = new Date(newWorkout.date_created);
      newWorkout.creator_id = ObjectId(newWorkout.creator_id);
      newWorkout.exercises.map((each) => (each.exercise_id = ObjectId(each.exercise_id)));

      const added = await db.collection("workouts").insertOne(newWorkout);

      added.insertedId ? res.status(201).end() : res.status(404).end();

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
