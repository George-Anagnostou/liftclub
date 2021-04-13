import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  const { workout_id } = req.query;

  switch (httpMethod) {
    case "GET":
      const workoutData = await db.collection("workouts").findOne({ _id: ObjectId(workout_id) });
      res.json(workoutData);
      break;
    case "POST":
      break;
    case "PUT":
      const updatedWorkout = JSON.parse(req.body);
      // Cast all string ids to ObjectIds
      updatedWorkout._id = ObjectId(updatedWorkout._id);
      updatedWorkout.creator_id = ObjectId(updatedWorkout.creator_id);
      updatedWorkout.exercises.map((each) => (each.exercise_id = ObjectId(each.exercise_id)));

      const updated = await db
        .collection("workouts")
        .replaceOne({ _id: updatedWorkout._id }, updatedWorkout);

      updated ? res.status(204).end() : res.status(404).end();

      break;
    case "DELETE":
      break;
  }
};
