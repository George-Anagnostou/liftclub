import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";
// Interfaces
import { User } from "../../../utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  const user_id: string = req.query.user_id[0];
  let userData: User;

  switch (httpMethod) {
    case "GET":
      /**
       *
       * QUERIES
       *
       */

      if (req.query.field === "savedWorkouts") {
        // GET aggregated savedWorkouts with interpolated workout data
        // ACCESSED WITH: /users/user_id?field=savedWorkouts

        const data = await db
          .collection("users")
          .aggregate([
            { $match: { _id: new ObjectId(user_id) } },
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
      } else if (req.query.username) {
        // Get a specific user from username

        userData = await db.collection("users").findOne({ username: req.query.username });

        delete userData.password;

        res.json(userData);
      } else {
        res.status(400).end();
      }

      break;
    case "POST":
      break;

    case "PUT":
      // Declare a field to update
      let fieldToUpdate = "";

      const { addSavedWorkout } = JSON.parse(req.body);
      if (addSavedWorkout) fieldToUpdate = "ADD_SAVED_WORKOUT";

      const { removeSavedWorkout } = JSON.parse(req.body);
      if (removeSavedWorkout) fieldToUpdate = "REMOVE_SAVED_WORKOUT";

      const { weight } = JSON.parse(req.body);
      if (weight) fieldToUpdate = "WEIGHT";

      const { follow } = JSON.parse(req.body);
      if (follow) fieldToUpdate = "FOLLOW";

      const { unfollow } = JSON.parse(req.body);
      if (unfollow) fieldToUpdate = "UNFOLLOW";

      const { bio } = JSON.parse(req.body);
      if (typeof bio === "string") fieldToUpdate = "BIO";

      const { joinTeam } = JSON.parse(req.body);
      if (joinTeam) fieldToUpdate = "JOIN_TEAM";

      const { leaveTeam } = JSON.parse(req.body);
      if (leaveTeam) fieldToUpdate = "LEAVE_TEAM";

      const { profileImgUrl } = JSON.parse(req.body);
      if (profileImgUrl) fieldToUpdate = "PROFILE_IMG_URL";

      if (req.query.fieldToUpdate === "ADD_WORKOUT_TO_WORKOUT_LOG")
        fieldToUpdate = "ADD_WORKOUT_TO_WORKOUT_LOG";

      switch (fieldToUpdate) {
        case "ADD_SAVED_WORKOUT":
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $push: { savedWorkouts: new ObjectId(addSavedWorkout) } }
            );

          res.json({});

          break;

        case "REMOVE_SAVED_WORKOUT":
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $pull: { savedWorkouts: new ObjectId(removeSavedWorkout) } }
            );

          res.json({});
          break;

        case "WEIGHT":
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $push: { weight: Number(weight) } }
            );

          res.json({});
          break;

        case "FOLLOW":
          // Push followee's id into user_id's following array
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $push: { following: new ObjectId(follow) } }
            );

          // Push user_id into followee's followers array
          await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(follow) },
              { $push: { followers: new ObjectId(user_id) } }
            );

          res.json({});
          break;

        case "UNFOLLOW":
          // Pull followee's id from user_id's following array
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $pull: { following: new ObjectId(unfollow) } }
            );

          // Pull user_id from followee's followers array
          await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(unfollow) },
              { $pull: { followers: new ObjectId(user_id) } }
            );

          res.json({});
          break;

        case "BIO":
          userData = await db
            .collection("users")
            .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $set: { bio: bio } });

          res.json({});
          break;

        case "JOIN_TEAM":
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $push: { teamsJoined: new ObjectId(joinTeam) } }
            );

          await db
            .collection("teams")
            .findOneAndUpdate(
              { _id: new ObjectId(joinTeam) },
              { $push: { members: new ObjectId(user_id) } }
            );

          res.json({});
          break;

        case "LEAVE_TEAM":
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $pull: { teamsJoined: new ObjectId(leaveTeam) } }
            );

          await db
            .collection("teams")
            .findOneAndUpdate(
              { _id: new ObjectId(leaveTeam) },
              { $pull: { members: new ObjectId(user_id) } }
            );

          res.json({});
          break;

        case "PROFILE_IMG_URL":
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $set: { profileImgUrl: profileImgUrl } }
            );

          userData ? res.status(201).json({}) : res.status(400).end();

          break;

        case "ADD_WORKOUT_TO_WORKOUT_LOG":
          const key = String(req.query.workoutLogKey);

          const workoutData = JSON.parse(req.body);

          // Format workoutData correctly for DB
          delete workoutData.workout;
          workoutData.exerciseData.map((each) => {
            delete each.exercise;
            each.exercise_id = new ObjectId(each.exercise_id);
          });
          workoutData.workout_id = new ObjectId(workoutData.workout_id);

          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $set: { [`workoutLog.${key}`]: workoutData } }
            );

          userData ? res.status(201).json({}) : res.status(400).end();
          break;

        default:
          res.status(404).end();
      }

      break;
    case "DELETE":
      if (req.query.fieldToUpdate === "DELETE_WORKOUT_FROM_WORKOUT_LOG") {
        const key = req.query.workoutLogKey;

        const deleted = await db
          .collection("users")
          .findOneAndUpdate(
            { _id: new ObjectId(user_id) },
            { $unset: { [`workoutLog.${key}`]: 1 } },
            { returnNewDocument: true }
          );

        deleted.value.workoutLog ? res.status(204).end() : res.status(404).end();
        break;
      }
      res.status(404).end();
      break;
  }
};
