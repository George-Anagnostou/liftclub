import { connectToDatabase } from "../../../utils/mongodb";
const bcrypt = require("bcrypt");
const saltRounds = 10;

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const users = await db.collection("users").findOne();
      console.log(users);
      res.json(users);

      break;
    case "POST":
      // Hash password input
      const { username, password } = JSON.parse(req.body);
      const hash = bcrypt.hashSync(password, saltRounds);

      const userData = await db
        .collection("users")
        .insertOne({
          username: username,
          password: hash,
          savedWorkouts: [],
          workoutLog: [],
          daysLeftInRoutine: 0,
        });

      console.log(userData);
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
