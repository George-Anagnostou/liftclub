import { MongoClient } from "mongodb";
import createUser from "../../../pages/api/users/createUser";

describe("Login route", () => {
  let req;
  let res;

  let userCreated: boolean = false;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      end: jest.fn(),
      json: jest.fn(() => res),
    };
  });

  test("should return test user data if creds are correct.", async () => {
    req.method = "POST";
    req.body = { username: "testbot0123456789", password: "123" };

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("should return a 403 for username already existing in db.", async () => {
    // if (!userCreated) fail();

    req.method = "POST";
    req.body = { username: "testbot0123456789", password: "123" };

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  test("should return a 405 if the method is not POST.", async () => {
    req.method = "GET";

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  test("cleanup test user account from db.", async () => {
    // if (!userCreated) fail();

    const connection = await MongoClient.connect(String(process.env.NEXT_PUBLIC_MONGODB_URI)!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = connection.db(process.env.NEXT_PUBLIC_MONGODB_DB);

    const { deletedCount } = await db
      .collection("users")
      .deleteOne({ username: "testbot0123456789" });

    expect(deletedCount).toEqual(1);

    await connection.close();
  });
});
