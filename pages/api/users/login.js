import { connectToDatabase } from "../../../utils/mongodb";
const bcrypt = require("bcrypt");

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      break;
    case "POST":
      const { username, password } = req.body;
      // Get user from db with username they entered
      const user = await db.collection("users").findOne({ username: username });

      if (!user) {
        res.status(401).end();
      } else {
        // Validate password entered with user.password retrieved from db
        const validLogin = bcrypt.compareSync(password, user.password); // true
        validLogin ? res.json(user) : res.status(400).end();
      }

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
