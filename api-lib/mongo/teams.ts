import { Team, NewTeam } from "../../types/interfaces";
import { ObjectId } from "mongodb";

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
