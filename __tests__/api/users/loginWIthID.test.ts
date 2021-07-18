import loginWithID from "../../../pages/api/users/loginWithID";

describe("LoginWithID route", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      end: jest.fn(),
      json: jest.fn(() => res),
    };
  });

  test("should return test user data if user_id is valid.", async () => {
    req.method = "POST";
    req.body = { user_id: "60ee1a6a45c7b811a0a9fad8" };

    await loginWithID(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("should return a 400 if user_id is invalid.", async () => {
    req.method = "POST";
    req.body = { user_id: "101010101010101010101010" };

    await loginWithID(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  test("should return a 405 if the method is not POST.", async () => {
    req.method = "GET";

    await loginWithID(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});

export {};
