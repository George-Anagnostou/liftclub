import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  const { user_id } = req.query;
  let userData;

  switch (httpMethod) {
    case "GET":
      // Get a specific user from _id
      userData = await db.collection("users").findOne({ _id: ObjectId(user_id) });
      res.json(userData);

      break;
    case "POST":
      break;
    case "PUT":
      // Push new workout to user savedWorkouts
      const workoutLog = JSON.parse(req.body);
      // Cast id strings to ObjIds
      workoutLog.map((entry) => {
        entry.workout_id = ObjectId(entry.workout_id);
        entry.exerciseData?.map((each) => (each.exercise_id = ObjectId(each.exercise_id)));
        // Cast isoDate string to Date()
        entry.isoDate = new Date(entry.isoDate);
      });

      userData = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: ObjectId(user_id) },
          { $set: { workoutLog: workoutLog } },
          { returnOriginal: false }
        );
        
      res.json(userData.value);
      break;
  }
};
