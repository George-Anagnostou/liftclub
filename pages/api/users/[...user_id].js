import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  const user_id = req.query.user_id[0];
  let userData;

  switch (httpMethod) {
    case "GET":
      if (req.query.field === "savedWorkouts") {
        /**
         * GET aggregated savedWorkouts with interpolated workout data
         */
        const data = await db
          .collection("users")
          .aggregate([
            { $match: { _id: ObjectId(user_id) } },
            {
              $lookup: {
                from: "workouts",
                localField: "savedWorkouts",
                foreignField: "_id",
                as: "data",
              },
            },
          ])
          .toArray();

        res.json(data[0].data);
      } else if (req.query.field === "workoutLog") {
        /**
         * GET aggregated workoutLog with interpolated workout and exercise data
         */
        const data = await db
          .collection("users")
          .aggregate([
            { $match: { _id: new ObjectId(user_id) } },
            { $unwind: "$workoutLog" },
            {
              $lookup: {
                from: "workouts",
                localField: "workoutLog.workout_id",
                foreignField: "_id",
                as: "workoutLog.workout",
              },
            },
            { $unwind: "$workoutLog.workout" },
            { $unwind: "$workoutLog.exerciseData" },
            {
              $lookup: {
                from: "exercises",
                localField: "workoutLog.exerciseData.exercise_id",
                foreignField: "_id",
                as: "workoutLog.exerciseData.exercise",
              },
            },
            { $unwind: "$workoutLog.exerciseData.exercise" },
            {
              $group: {
                _id: "$workoutLog.isoDate",
                root: { $mergeObjects: "$$ROOT" },
                exerciseData: { $push: "$workoutLog.exerciseData" },
              },
            },
            { $sort: { _id: 1 } },
            { $replaceRoot: { newRoot: { $mergeObjects: ["$root", "$$ROOT"] } } },
            { $set: { "workoutLog.exerciseData": "$exerciseData" } },
            {
              $group: {
                _id: "$root._id",
                root: { $mergeObjects: "$$ROOT" },
                workoutLog: { $push: "$workoutLog" },
              },
            },
            { $replaceRoot: { newRoot: { $mergeObjects: ["$root", "$$ROOT"] } } },
            { $project: { root: 0 } },
          ])
          .toArray();

        // Find queried workout and return
        const foundWorkout = data[0].workoutLog.filter(
          (item) => item.isoDate.toISOString() === req.query.date
        );

        res.json(foundWorkout[0]);
      } else {
        // Get a specific user from _id
        userData = await db.collection("users").findOne({ _id: ObjectId(user_id) });
        res.json(userData);
      }

      break;
    case "POST":
      break;
    case "PUT":
      // Declare a field to update
      let fieldToUpdate;

      const { workoutLog } = JSON.parse(req.body);
      if (workoutLog) fieldToUpdate = "workoutLog";

      const { savedWorkouts } = JSON.parse(req.body);
      if (savedWorkouts) fieldToUpdate = "savedWorkouts";

      const { weight } = JSON.parse(req.body);
      if (weight) fieldToUpdate = "weight";

      switch (fieldToUpdate) {
        case "workoutLog":
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

        case "savedWorkouts":
          const ObjIdArr = savedWorkouts.map((id) => ObjectId(id));

          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: ObjectId(user_id) },
              { $set: { savedWorkouts: ObjIdArr } },
              { returnOriginal: false }
            );
          res.json(userData.value);
          break;

        case "weight":
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: ObjectId(user_id) },
              { $push: { weight: Number(weight) } },
              { returnOriginal: false }
            );
          res.json(userData.value);
          break;
      }

      break;
    case "DELETE":
      if (req.query.field === "workoutLog") {
        const updated = await db
          .collection("users")
          .findOneAndUpdate(
            { _id: ObjectId(user_id) },
            { $pull: { workoutLog: { isoDate: new Date(req.query.date) } } },
            { returnOriginal: false }
          );

        res.json(updated.value.workoutLog);
      }

      res.status(404).send();
      break;
  }
};
