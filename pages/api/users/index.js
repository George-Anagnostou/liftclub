import { connectToDatabase } from "../../../utils/mongodb";
const bcrypt = require("bcryptjs");
const saltRounds = 10;

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      res.status(403).end();
      break;
    case "POST":
      // Hash password input
      const { username, password } = req.body;
      const hash = bcrypt.hashSync(password, saltRounds);

      const existingUser = await db.collection("users").findOne({ username: username });

      if (!existingUser) {
        const userData = await db.collection("users").insertOne({
          username: username,
          password: hash,
          savedWorkouts: [],
          workoutLog: [],
          daysLeftInRoutine: 0,
        });

        res.json(userData.ops[0]);
      } else {
        res.status(403).end();
      }
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
