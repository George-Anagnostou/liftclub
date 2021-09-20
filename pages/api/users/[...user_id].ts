import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";
// Interfaces
import { User } from "../../../utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  const user_id: string = req.query.user_id[0];
  let userData: { value: User; password?: string };

  switch (httpMethod) {
    case "GET":
      /**
       *
       * QUERIES
       *
       */

      if (req.query.username) {
        // Get a specific user from username

        userData = await db.collection("users").findOne({ username: req.query.username });

        delete userData.password;

        res.status(200).json(userData);
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

      const { addToRecentlyViewedUsers } = JSON.parse(req.body);
      if (addToRecentlyViewedUsers) fieldToUpdate = "ADD_ID_TO_RECENTLY_VIEWED_USERS";

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

          res.status(201).json({});
          break;

        case "REMOVE_SAVED_WORKOUT":
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $pull: { savedWorkouts: new ObjectId(removeSavedWorkout) } }
            );

          res.status(201).json({});
          break;

        case "WEIGHT":
          userData = await db
            .collection("users")
            .findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $push: { weight: Number(weight) } }
            );

          res.status(201).json({});
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

          res.status(201).json({});
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

          res.status(201).json({});
          break;

        case "BIO":
          userData = await db
            .collection("users")
            .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $set: { bio: bio } });

          res.status(201).json({});
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

          res.status(201).json({});
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

          res.status(201).json({});
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

        case "ADD_ID_TO_RECENTLY_VIEWED_USERS":
          userData = await db.collection("users").findOneAndUpdate(
            { _id: new ObjectId(user_id) },
            {
              $push: {
                recentlyViewedUsers: {
                  $each: [new ObjectId(addToRecentlyViewedUsers)],
                  $position: 0,
                },
              },
            }
          );

          res.status(201).json({});
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

          if (!userData.value.workoutLog[key]) {
            // User saved a new workout, so increment workout numLogged
            db.collection("workouts").findOneAndUpdate(
              { _id: workoutData.workout_id },
              { $inc: { numLogged: 1 } }
            );
          }

          userData ? res.status(201).json({}) : res.status(400).end();
          break;

        default:
          res.status(404).end();
      }

      break;

    case "DELETE":
      if (req.query.fieldToUpdate === "DELETE_WORKOUT_FROM_WORKOUT_LOG") {
        let key = req.query.workoutLogKey;
        if (typeof key !== "string") key = req.query.workoutLogKey[0];

        userData = await db
          .collection("users")
          .findOneAndUpdate(
            { _id: new ObjectId(user_id) },
            { $unset: { [`workoutLog.${key}`]: 1 } }
          );

        // User deleted a new workout, so decrement workout numLogged
        db.collection("workouts").findOneAndUpdate(
          { _id: new ObjectId(userData.value.workoutLog[key].workout_id) },
          { $inc: { numLogged: -1 } }
        );

        userData.value.workoutLog ? res.status(204).end() : res.status(404).end();
        break;
      }
      res.status(404).end();
      break;
  }
};
