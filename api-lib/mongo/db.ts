import {
  NewWorkout,
  Exercise,
  Workout,
  User,
  NewExercise,
  NewRoutine,
  Routine,
  Team,
  NewTeam,
  WorkoutLogItem,
  ShortUser,
} from "../../types/interfaces";
import { ObjectId } from "mongodb";

// Workouts

export async function queryWorkoutsByIdArr(db: any, idArr: string[]) {
  const workouts: Workout[] = await db
    .collection("workouts")
    .find({
      _id: { $in: idArr.map((_id) => new ObjectId(_id)) },
    })
    .toArray();
  return workouts;
}

export async function queryWorkoutsByCreatorId(db: any, creator_id: string) {
  const workouts: Workout[] = await db
    .collection("workouts")
    .find({ creator_id: new ObjectId(creator_id.toString()) })
    .toArray();
  return workouts;
}

export async function findPublicWorkouts(db: any) {
  const workouts: Workout[] = await db.collection("workouts").find({ isPublic: true }).toArray();
  return workouts;
}

export async function postNewWorkout(db: any, workout: NewWorkout) {
  const { insertedId } = await db.collection("workouts").insertOne(workout);
  return insertedId as string;
}

export async function updateWorkout(db: any, workout: Workout) {
  const updated: boolean = await db
    .collection("workouts")
    .replaceOne({ _id: workout._id }, workout);
  return updated;
}

export async function getWorkout(db: any, id: string) {
  const workout: Workout = await db.collection("workouts").findOne({ _id: new ObjectId(id) });
  return workout;
}

export async function deleteWorkout(db: any, id: string) {
  const deleted = await db.collection("workouts").deleteOne({ _id: new ObjectId(id) });
  return Boolean(deleted.deletedCount);
}

export async function incrementWorkoutNumLogged(db: any, workout_id: string) {
  const updated: boolean = await db
    .collection("workouts")
    .findOneAndUpdate({ _id: workout_id }, { $inc: { numLogged: 1 } });
  return updated;
}

export async function decrementWorkoutNumLogged(db: any, workout_id: string) {
  const updated: boolean = await db
    .collection("workouts")
    .findOneAndUpdate({ _id: new ObjectId(workout_id) }, { $inc: { numLogged: -1 } });
  return updated;
}

// Users

export async function getUserById(db: any, id: string) {
  const user: User = await db.collection("users").findOne({ _id: new ObjectId(id) });
  return user;
}

export async function getUserByUsername(db: any, username: string) {
  const user: User = await db.collection("users").findOne({ username: username });
  return user;
}

export async function updateUserLastLoggedIn(db: any, id: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { lastLoggedIn: new Date().toISOString() } }
    );
  return updated;
}

export async function addToUserSavedWorkouts(db: any, user_id: string, workout_id: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $push: { savedWorkouts: new ObjectId(workout_id) } }
    );
  return updated;
}
export async function removeFromUserSavedWorkouts(db: any, user_id: string, workout_id: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $pull: { savedWorkouts: new ObjectId(workout_id) } }
    );
  return updated;
}

export async function pushToUserWeight(db: any, user_id: string, weight: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $push: { weight: Number(weight) } });
  return updated;
}

export async function addIdToUserFollowing(db: any, user_id: string, add_id: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $push: { following: new ObjectId(add_id) } }
    );
  return updated;
}

export async function addIdToUserFollowers(db: any, user_id: string, add_id: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $push: { followers: new ObjectId(add_id) } }
    );
  return updated;
}

export async function removeIdFromUserFollowing(db: any, user_id: string, remove_id: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $pull: { following: new ObjectId(remove_id) } }
    );

  return updated;
}

export async function removeIdFromUserFollowers(db: any, user_id: string, remove_id: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $pull: { followers: new ObjectId(remove_id) } }
    );
  return updated;
}

export async function updateUserBio(db: any, user_id: string, bio: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $set: { bio: bio } });
  return updated;
}

export async function userJoiningTeam(db: any, user_id: string, team_id: string) {
  let updated: boolean = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $push: { teamsJoined: new ObjectId(team_id) } }
    );

  updated = await db
    .collection("teams")
    .findOneAndUpdate(
      { _id: new ObjectId(team_id) },
      { $push: { members: new ObjectId(user_id) } }
    );

  return updated;
}

export async function userLeavingTeam(db: any, user_id: string, team_id: string) {
  let updated: boolean = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $pull: { teamsJoined: new ObjectId(team_id) } }
    );

  updated = await db
    .collection("teams")
    .findOneAndUpdate(
      { _id: new ObjectId(team_id) },
      { $pull: { members: new ObjectId(user_id) } }
    );

  return updated;
}

export async function updateUserProfileImgUrl(db: any, user_id: string, profileImgUrl: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $set: { profileImgUrl: profileImgUrl } });
  return updated;
}

export async function addIdToUserRecentlyViewedUsers(db: any, user_id: string, viewed_id: string) {
  const updated: boolean = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $push: { recentlyViewedUsers: { $each: [new ObjectId(viewed_id)], $position: 0 } } }
    );
  return updated;
}

export async function addNewEntryInWorkoutLog(
  db: any,
  user_id: string,
  date: string,
  workoutData: WorkoutLogItem
) {
  const data = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $set: { [`workoutLog.${date}`]: workoutData } }
    );
  const isNewWorkout = !Boolean(data.value.workoutLog[date]);
  const saved = Boolean(data.ok);
  return [isNewWorkout, saved];
}

export async function removeEntryFromWorkoutLog(db: any, user_id: string, date: string) {
  const data = await db
    .collection("users")
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $unset: { [`workoutLog.${date}`]: 1 } });
  const removedWorkout_id = data.value.workoutLog[date].workout_id;
  const saved = Boolean(data.ok);
  return [removedWorkout_id, saved];
}

export async function postNewUser(db: any, username: string, passwordHash: string) {
  const data = await db.collection("users").insertOne({
    username: username,
    password: passwordHash,
    savedWorkouts: [],
    workoutLog: {},
    accountCreated: new Date().toISOString(),
    lastLoggedIn: new Date().toISOString(),
  });
  const user: User = data.ops[0];
  delete user.password;
  return user;
}

export async function getShortUsersFromIdArr(db: any, idArr: string[]) {
  const users: ShortUser[] = await db
    .collection("users")
    .find({ _id: { $in: idArr.map((_id) => new ObjectId(_id)) } })
    .project({ username: 1, profileImgUrl: 1 })
    .toArray();
  return users;
}

export async function searchUsernameQuery(db: any, query: string) {
  const foundUsers: ShortUser[] = await db
    .collection("users")
    .aggregate([
      { $match: { username: { $regex: query, $options: "i" } } },
      {
        $project: {
          _id: 1,
          username: 1,
          profileImgUrl: 1,
          w: {
            $cond: [
              {
                $eq: [
                  { $substr: [{ $toLower: "$username" }, 0, query.length] },
                  query.toLocaleLowerCase(),
                ],
              },
              1,
              0,
            ],
          },
        },
      },
      { $sort: { w: -1 } },
    ])
    .toArray();

  return foundUsers;
}

// Exercises

export async function queryExercises(db: any, query) {
  const exercises: Exercise[] = await db.collection("exercises").find(query).toArray();
  return exercises;
}

export async function postNewExercise(db: any, exercise: NewExercise) {
  const { insertedId } = await db.collection("exercises").insertOne(exercise);
  return insertedId as string;
}

export async function queryExercisesByIdArr(db: any, idArr: string[]) {
  const exercises: Exercise[] = await db
    .collection("exercises")
    .find({
      _id: { $in: idArr.map((_id) => new ObjectId(_id)) },
    })
    .toArray();
  return exercises;
}

// Routines

export async function postNewRoutine(db: any, routine: NewRoutine) {
  const { insertedId } = await db.collection("routines").insertOne(routine);
  return insertedId as string;
}

export async function updateRoutine(db: any, routine: Routine) {
  const updated: boolean = await db
    .collection("routines")
    .replaceOne({ _id: new ObjectId(routine._id) }, routine);
  return updated;
}

export async function deleteRoutine(db: any, id: string) {
  const deleted = await db.collection("routines").deleteOne({ _id: new ObjectId(id) });
  return Boolean(deleted.deletedCount);
}

export async function getRoutine(db: any, id: string) {
  const routine: Routine = await db.collection("routines").findOne({ _id: new ObjectId(id) });
  return routine;
}

export async function getAggregatedRoutinesById(
  db: any,
  id: string,
  property: "_id" | "creator_id" = "_id"
) {
  const routines: Routine[] = await db
    .collection("routines")
    .aggregate([
      { $match: { [property]: new ObjectId(id) } },
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
  // TODO create a way to handle returning a routine that has workouts in
  // the workout plan that are no longer in the database
  return routines;
}

// Teams

export async function getTeam(db: any, id: string) {
  const team: Team = await db.collection("teams").findOne({ _id: new ObjectId(id) });
  return team;
}

export async function getTeamsByCreatorId(db: any, id: string) {
  const teams: Team[] = await db
    .collection("teams")
    .find({ creator_id: new ObjectId(id) })
    .toArray();
  return teams;
}

export async function updateTeam(db: any, team: Team) {
  const updated: boolean = await db
    .collection("teams")
    .replaceOne({ _id: new ObjectId(team._id) }, team);
  return updated;
}

export async function postTeam(db: any, team: NewTeam) {
  const { insertedId } = await db.collection("teams").insertOne(team);
  return insertedId as string;
}

export async function deleteTeam(db: any, id: string) {
  const deleted = await db.collection("teams").deleteOne({ _id: new ObjectId(id) });
  return Boolean(deleted.deletedCount);
}

export async function addTrainerToTeam(db: any, team_id: string, trainer_id: string) {
  const updated = await db
    .collection("teams")
    .findOneAndUpdate(
      { _id: new ObjectId(team_id) },
      { $push: { trainers: new ObjectId(trainer_id) } },
      { returnNewDocument: true }
    );
  return Boolean(updated.ok);
}

export async function removeTrainerFromTeam(db: any, team_id: string, trainer_id: string) {
  const updated = await db
    .collection("teams")
    .findOneAndUpdate(
      { _id: new ObjectId(team_id) },
      { $pull: { trainers: new ObjectId(trainer_id) } },
      { returnNewDocument: true }
    );

  return Boolean(updated.ok);
}

export async function getAggregatedTeamsById(
  db: any,
  id: string,
  property: "_id" | "creator_id" = "_id"
) {
  const teamData: Team[] = await db
    .collection("teams")
    .aggregate([
      { $match: { [property]: new ObjectId(id) } },
      {
        $lookup: {
          from: "routines",
          localField: "routine_id",
          foreignField: "_id",
          as: "routine",
        },
      },
      { $unwind: "$routine" },
      {
        $lookup: {
          from: "users",
          localField: "trainers",
          foreignField: "_id",
          as: "trainers",
        },
      },
      {
        $project: {
          _id: 1,
          teamName: 1,
          members: 1,
          dateCreated: 1,
          creatorName: 1,
          creator_id: 1,
          routine_id: 1,
          routine: 1,
          "trainers._id": 1,
          "trainers.username": 1,
          "trainers.profileImgUrl": 1,
        },
      },
    ])
    .toArray();

  return teamData;
}

export async function queryAllTeamsByMemberCount(db: any) {
  const teams: Team[] = await db
    .collection("teams")
    .aggregate([
      { $addFields: { membersCount: { $size: { $ifNull: ["$members", []] } } } },
      { $sort: { membersCount: -1 } },
    ])
    .toArray();
  return teams;
}

export async function getAllTeamsWithRoutineDataByTeamIdArr(db: any, idArr: string[]) {
  const teams: Team[] = await db
    .collection("teams")
    .aggregate([
      { $match: { _id: { $in: idArr.map((_id) => new ObjectId(_id)) } } },
      {
        $lookup: {
          from: "routines",
          localField: "routine_id",
          foreignField: "_id",
          as: "routine",
        },
      },
      { $unwind: "$routine" },
    ])
    .toArray();

  return teams;
}
