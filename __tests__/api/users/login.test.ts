import login from "../../../pages/api/users/login";
import { MongoClient } from "mongodb";

const __MONGO_URI__ = process.env.NEXT_PUBLIC_MONGODB_URI;
const __MONGO_DB_NAME__ = process.env.NEXT_PUBLIC_MONGODB_DB;

if (!__MONGO_URI__) throw new Error("Missing environment variable MONGO_URI");
if (!__MONGO_DB_NAME__) throw new Error("Missing environment variable MONGO_DB");

describe("insert User document", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db("workoutApp");
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it("should insert User doc into collection", async () => {
    const users = db.collection("users");

    interface UserLogin {
      username: string;
      password: string;
    }

    const mockUser: UserLogin = { username: "TestingAccount", password: "123" };

    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ username: "TestingAccount" });

    expect(insertedUser).toEqual(mockUser);
  });

  it("should delete User doc from collection", async () => {
    const users = db.collection("users");

    const { deletedCount } = await users.deleteOne({ username: "TestingAccount" });

    expect(deletedCount).toEqual(1);
  });
});

// describe("Login route", () => {
//   let req;
//   let res;

//   beforeEach(() => {
//     req = {};
//     res = {
//       status: jest.fn(() => res),
//       end: jest.fn(),
//     };
//   });

//   it("Should return a 405 if the method is not POST.", async () => {
//     req.method = "POST";

//     const response = await login(req, res);

//     expect(res.status).toHaveBeenCalledWith(405);
//     expect(res.end).toHaveBeenCalledTimes(1);
//   });
// });
