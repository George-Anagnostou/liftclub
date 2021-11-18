import { Exercise, NewExercise } from "../../types/interfaces";
import { ObjectId } from "mongodb";

export async function queryExercises(db: any, query) {
  const exercises: Exercise[] = await db.collection("exercises").find(query).toArray();
  return exercises;
}

export async function getDefaultExercises(db: any) {
  return await queryExercises(db, { isDefault: true });
}

export async function postNewExercise(db: any, exercise: NewExercise) {
  const { insertedId } = await db.collection("exercises").insertOne(exercise);
  return insertedId as string;
}

export async function deleteExercise(db: any, id: string) {
  const deleted = await db.collection("exercises").deleteOne({ _id: new ObjectId(id) });
  return Boolean(deleted.deletedCount);
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
