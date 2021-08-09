import user_id from "../../../pages/api/users/[...user_id]";

describe("User_id route", () => {
  let req;
  let res;
  const test_user_id = "60ee1a6a45c7b811a0a9fad8";
  const test_workout_id = "60fadccb19f5372f057b057b";
  const test_team_id = "60fadccb19f5372f057b057f";
  const test_exercise_id = "60bd71989dcf84000890784a";

  beforeEach(() => {
    req = { query: { user_id: [test_user_id] } };
    res = {
      status: jest.fn(() => res),
      end: jest.fn(),
      json: jest.fn(() => res),
    };
  });

  /**
   *
   * Method: GET
   *
   */
  test("should return user data for a GET request querying by username.", async () => {
    req.method = "GET";
    req.query = { ...req.query, username: "Christian2" };

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("should return a 400 if username is not in the request object", async () => {
    req.method = "GET";
    req.query = { ...req.query, userTypo: "Christian2" };

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  /**
   *
   * Method: PUT
   *
   */

  // Saved Workouts
  test("should return a 201 when adding a saved workout.", async () => {
    req.method = "PUT";
    req.body = JSON.stringify({ addSavedWorkout: test_workout_id });

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("should return a 201 when removing a saved workout.", async () => {
    req.method = "PUT";
    req.body = JSON.stringify({ removeSavedWorkout: test_workout_id });

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  // Weight
  test("should return a 201 when inserting a weight.", async () => {
    req.method = "PUT";
    req.body = JSON.stringify({ weight: 100 });

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  // Follows
  test("should return a 201 when following another user.", async () => {
    req.method = "PUT";
    req.body = JSON.stringify({ follow: test_user_id });

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("should return a 201 when unfollowing another user.", async () => {
    req.method = "PUT";
    req.body = JSON.stringify({ unfollow: test_user_id });

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  // Bio
  test("should return a 201 when updating bio.", async () => {
    req.method = "PUT";
    req.body = JSON.stringify({ bio: "Such a useful test bot I am." });

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  // Teams Joined
  test("should return a 201 when joining a team.", async () => {
    req.method = "PUT";
    req.body = JSON.stringify({ joinTeam: test_team_id });

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("should return a 201 when leaving a team.", async () => {
    req.method = "PUT";
    req.body = JSON.stringify({ leaveTeam: test_team_id });

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  //Profile Img Url
  test("should return a 201 when updating profileImgUrl.", async () => {
    req.method = "PUT";
    req.body = JSON.stringify({ profileImgUrl: "Christian2" });

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  // WorkoutLog
  test("should return a 201 when updating a workout in workoutLog.", async () => {
    req.method = "PUT";
    req.query = {
      ...req.query,
      fieldToUpdate: "ADD_WORKOUT_TO_WORKOUT_LOG",
      workoutLogKey: "2000-01-01",
    };
    req.body = JSON.stringify({
      completed: true,
      exerciseData: [
        {
          exercise_id: test_exercise_id,
          sets: [{ reps: 0, weight: 0 }],
          exercise: "",
        },
      ],
      workoutNote: "string",
      workout_id: test_workout_id,
    });

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("should return a 204 when deleting a workout from workoutLog.", async () => {
    req.method = "DELETE";
    req.query = {
      ...req.query,
      fieldToUpdate: "DELETE_WORKOUT_FROM_WORKOUT_LOG",
      workoutLogKey: "2000-01-01",
    };

    await user_id(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});

export {};
