import { User, WorkoutLogItem, ShortUser } from "../../types/interfaces";
import { ObjectId } from "mongodb";

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
