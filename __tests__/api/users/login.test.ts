import login from "../../../pages/api/users/login";

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

  test("should return test user data if creds are correct.", async () => {
    req.method = "POST";
    req.body = { username: "Christian2", password: "123" };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("should return a 401 if username is incorrect.", async () => {
    req.method = "POST";
    req.body = { username: "Christian1", password: "123" };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  test("should return a 400 if password is incorrect.", async () => {
    req.method = "POST";
    req.body = { username: "Christian2", password: "321" };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  test("should return a 405 if the method is not POST.", async () => {
    req.method = "GET";

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});

export {};
