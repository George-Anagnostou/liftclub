import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../utils/mongodb";
import {
  addIdToUserFollowers,
  addIdToUserFollowing,
  addIdToUserRecentlyViewedUsers,
  addNewEntryInWorkoutLog,
  addToUserSavedWorkouts,
  decrementWorkoutNumLogged,
  getUserByUsername,
  incrementWorkoutNumLogged,
  pushToUserWeight,
  removeEntryFromWorkoutLog,
  removeFromUserSavedWorkouts,
  removeIdFromUserFollowers,
  removeIdFromUserFollowing,
  updateUserBio,
  updateUserProfileImgUrl,
  userJoiningTeam,
  userLeavingTeam,
} from "../../../api-lib/mongo";
import { verifyAuthToken } from "../../../api-lib/auth/middleware";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();
  const user_id: string = req.query.user_id[0];

  switch (httpMethod) {
    case "GET":
      if (req.query.username) {
        const user = await getUserByUsername(db, req.query.username.toString());
        delete user.password;
        res.status(200).json(user);
      }

      res.status(400).end();

      break;
    case "POST":
      break;

    case "PUT":
      let validId = verifyAuthToken(req, user_id);
      if (!validId) return res.status(401).end();

      // Declare a field to update
      let UPDATE_FIELD = "";
      let UPDATED = false;

      const { addSavedWorkout } = JSON.parse(req.body);
      if (addSavedWorkout) UPDATE_FIELD = "ADD_SAVED_WORKOUT";

      const { removeSavedWorkout } = JSON.parse(req.body);
      if (removeSavedWorkout) UPDATE_FIELD = "REMOVE_SAVED_WORKOUT";

      const { weight } = JSON.parse(req.body);
      if (weight) UPDATE_FIELD = "WEIGHT";

      const { follow } = JSON.parse(req.body);
      if (follow) UPDATE_FIELD = "FOLLOW";

      const { unfollow } = JSON.parse(req.body);
      if (unfollow) UPDATE_FIELD = "UNFOLLOW";

      const { bio } = JSON.parse(req.body);
      if (typeof bio === "string") UPDATE_FIELD = "BIO";

      const { joinTeam } = JSON.parse(req.body);
      if (joinTeam) UPDATE_FIELD = "JOIN_TEAM";

      const { leaveTeam } = JSON.parse(req.body);
      if (leaveTeam) UPDATE_FIELD = "LEAVE_TEAM";

      const { profileImgUrl } = JSON.parse(req.body);
      if (profileImgUrl) UPDATE_FIELD = "PROFILE_IMG_URL";

      const { addToRecentlyViewedUsers } = JSON.parse(req.body);
      if (addToRecentlyViewedUsers) UPDATE_FIELD = "ADD_ID_TO_RECENTLY_VIEWED_USERS";

      if (req.query.fieldToUpdate === "ADD_WORKOUT_TO_WORKOUT_LOG")
        UPDATE_FIELD = "ADD_WORKOUT_TO_WORKOUT_LOG";

      switch (UPDATE_FIELD) {
        case "ADD_SAVED_WORKOUT":
          UPDATED = await addToUserSavedWorkouts(db, user_id, addSavedWorkout);
          break;

        case "REMOVE_SAVED_WORKOUT":
          UPDATED = await removeFromUserSavedWorkouts(db, user_id, removeSavedWorkout);
          break;

        case "WEIGHT":
          UPDATED = await pushToUserWeight(db, user_id, weight);
          break;

        case "FOLLOW":
          UPDATED = await addIdToUserFollowing(db, user_id, follow);
          UPDATED = await addIdToUserFollowers(db, follow, user_id);
          break;

        case "UNFOLLOW":
          UPDATED = await removeIdFromUserFollowing(db, user_id, unfollow);
          UPDATED = await removeIdFromUserFollowers(db, unfollow, user_id);
          break;

        case "BIO":
          UPDATED = await updateUserBio(db, user_id, bio);
          break;

        case "JOIN_TEAM":
          UPDATED = await userJoiningTeam(db, user_id, joinTeam);
          break;

        case "LEAVE_TEAM":
          UPDATED = await userLeavingTeam(db, user_id, leaveTeam);
          break;

        case "PROFILE_IMG_URL":
          UPDATED = await updateUserProfileImgUrl(db, user_id, profileImgUrl);
          break;

        case "ADD_ID_TO_RECENTLY_VIEWED_USERS":
          UPDATED = await addIdToUserRecentlyViewedUsers(db, user_id, addToRecentlyViewedUsers);
          break;

        case "ADD_WORKOUT_TO_WORKOUT_LOG":
          const key = req.query.workoutLogKey.toString();
          const workoutData = JSON.parse(req.body);

          // Format workoutData correctly for DB
          delete workoutData.workout;
          workoutData.workout_id = new ObjectId(workoutData.workout_id);
          workoutData.exerciseData.map((each) => {
            delete each.exercise;
            each.exercise_id = new ObjectId(each.exercise_id);
          });

          const [isNewWorkout, saved] = await addNewEntryInWorkoutLog(
            db,
            user_id,
            key,
            workoutData
          );
          UPDATED = saved;

          if (isNewWorkout) incrementWorkoutNumLogged(db, workoutData.workout_id);
          break;

        default:
          res.status(404).end();
      }

      UPDATED ? res.status(201).json({}) : res.status(400).end();

      break;

    case "DELETE":
      if (req.query.fieldToUpdate === "DELETE_WORKOUT_FROM_WORKOUT_LOG") {
        let validId = verifyAuthToken(req, user_id);
        if (!validId) return res.status(401).end();

        let key = req.query.workoutLogKey;
        if (typeof key !== "string") key = req.query.workoutLogKey[0];

        const [removedWorkout_id, saved] = await removeEntryFromWorkoutLog(db, user_id, key);
        decrementWorkoutNumLogged(db, removedWorkout_id);

        saved ? res.status(204).end() : res.status(404).end();
        break;
      }
      res.status(404).end();
      break;
  }
};
