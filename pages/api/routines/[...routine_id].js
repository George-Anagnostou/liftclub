import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  const routine_id = req.query.routine_id[0];

  switch (httpMethod) {
    case "GET":
      const routineData = await db
        .collection("routines")
        .aggregate([
          { $match: { _id: ObjectId(routine_id) } },
          { $unwind: { path: "$workoutPlan" } },
          {
            $lookup: {
              from: "workouts",
              localField: "workoutPlan.workout_id",
              foreignField: "_id",
              as: "workoutPlan.workout",
            },
          },
          { $unwind: { path: "$workoutPlan.workout" } },
          {
            $group: {
              _id: "$_id",
              root: { $mergeObjects: "$$ROOT" },
              workoutPlan: { $push: "$workoutPlan" },
            },
          },
          { $replaceRoot: { newRoot: { $mergeObjects: ["$root", "$$ROOT"] } } },
          { $project: { root: 0 } },
        ])
        .toArray();

      res.json(routineData[0]);
      break;
    case "POST":
      break;
    case "PUT":
      const { updatedRoutine } = JSON.parse(req.body);

      updatedRoutine.workoutPlan.map((entry) => {
        entry.workout_id = ObjectId(entry.workout_id);
        entry.isoDate = new Date(entry.isoDate);
      });
      updatedRoutine.creator_id = ObjectId(updatedRoutine.creator_id);
      updatedRoutine._id = ObjectId(updatedRoutine._id);

      const updated = await db
        .collection("routines")
        .replaceOne({ _id: ObjectId(routine_id) }, updatedRoutine);

      updated ? res.status(204).end() : res.status(404).end();

      break;
    case "DELETE":
      break;
  }
};
