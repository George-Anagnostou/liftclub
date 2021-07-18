import loginWithID from "../../../pages/api/users/loginWithID";

describe("Login route", () => {
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

  it("should return test user data if creds are correct.", async () => {
    req.method = "POST";
    req.body = { user_id: "60ee1a6a45c7b811a0a9fad8" };

    await loginWithID(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it("should return a 400 if user_id does not exist.", async () => {
    req.method = "POST";
    req.body = { user_id: "101010101010101010101010" };

    await loginWithID(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  it("should return a 405 if the method is not POST.", async () => {
    req.method = "GET";

    await loginWithID(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});

export {};
