import loginWithToken from "../../../pages/api/users/loginWithToken";
import * as jwt from "jsonwebtoken";

describe("LoginWithID route", () => {
  let req;
  let res;
  const test_id = "60ee1a6a45c7b811a0a9fad8";
  const JWT_SECRET = process.env.JWT_SECRET || "";
  const testToken = jwt.sign({ id: test_id }, JWT_SECRET);

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      end: jest.fn(),
      json: jest.fn(() => res),
    };
  });

  test("should return test user data if token is valid.", async () => {
    req.method = "POST";
    req.body = { token: testToken };

    await loginWithToken(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("should return a 400 if token is invalid.", async () => {
    req.method = "POST";
    req.body = { token: "101010101010101010101010" };

    await loginWithToken(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  test("should return a 405 if the method is not POST.", async () => {
    req.method = "GET";

    await loginWithToken(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});

export {};
