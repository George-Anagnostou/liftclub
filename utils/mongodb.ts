import { MongoClient } from "mongodb";

let uri = process.env.NEXT_PUBLIC_MONGODB_URI as string;
let dbName = process.env.NEXT_PUBLIC_MONGODB_DB as string;

if (!uri) throw new Error("Missing environment variable MONGO_URI");
if (!dbName) throw new Error("Missing environment variable MONGO_DB");

export async function connectToDatabase() {
  if (global.connection) return global.connection;

  if (!global.connectionPromise) {
    global.connectionPromise = MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  const client = await global.connectionPromise;
  const db = await client.db(dbName);

  global.connection = { client, db };

  return global.connection;
}
