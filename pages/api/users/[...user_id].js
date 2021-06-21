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
      if (workoutLog) fieldToUpdate = "WORKOUT_LOG";

      const { savedWorkouts } = JSON.parse(req.body);
      if (savedWorkouts) fieldToUpdate = "SAVED_WORKOUTS";

      const { weight } = JSON.parse(req.body);
      if (weight) fieldToUpdate = "WEIGHT";

      const { follow } = JSON.parse(req.body);
      if (follow) fieldToUpdate = "FOLLOW";

      const { unfollow } = JSON.parse(req.body);
      if (unfollow) fieldToUpdate = "UNFOLLOW";

      const { bio } = JSON.parse(req.body);
      if (typeof bio === "string") fieldToUpdate = "BIO";

      switch (fieldToUpdate) {
        case "WORKOUT_LOG":
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
              { returnNewDocument: true }
            );
          res.json(userData.value);
          break;

        case "SAVED_WORKOUTS":
          const ObjIdArr = savedWorkouts.map((id) => ObjectId(id));

          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: ObjectId(user_id) },
              { $set: { savedWorkouts: ObjIdArr } },
              { returnNewDocument: true }
            );
          res.json(userData.value);
          break;

        case "WEIGHT":
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: ObjectId(user_id) },
              { $push: { weight: Number(weight) } },
              { returnNewDocument: true }
            );
          res.json(userData.value);
          break;

        case "FOLLOW":
          // Push followee's id into user_id's following array
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: ObjectId(user_id) },
              { $push: { following: ObjectId(follow) } },
              { returnNewDocument: true }
            );

          // Push user_id into followee's followers array
          await db
            .collection("users")
            .findOneAndUpdate(
              { _id: ObjectId(follow) },
              { $push: { followers: ObjectId(user_id) } }
            );

          res.json({});
          break;

        case "UNFOLLOW":
          // Pull followee's id from user_id's following array
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: ObjectId(user_id) },
              { $pull: { following: ObjectId(unfollow) } },
              { returnNewDocument: true }
            );

          // Pull user_id from followee's followers array
          await db
            .collection("users")
            .findOneAndUpdate(
              { _id: ObjectId(unfollow) },
              { $pull: { followers: ObjectId(user_id) } }
            );

          res.json({});
          break;

        case "BIO":
          userData = await db
            .collection("users")
            .findOneAndUpdate({ _id: ObjectId(user_id) }, { $set: { bio: bio } });

          res.json({});
          break;

        default:
          res.status(404).send();
      }

      break;
    case "DELETE":
      if (req.query.field === "workoutLog") {
        const updated = await db
          .collection("users")
          .findOneAndUpdate(
            { _id: ObjectId(user_id) },
            { $pull: { workoutLog: { isoDate: new Date(req.query.date) } } },
            { returnNewDocument: true }
          );

        res.json(updated.value.workoutLog);
      }

      res.status(404).send();
      break;
  }
};
