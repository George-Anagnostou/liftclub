import { connectToDatabase } from "../../../utils/mongodb";

export default async (req, res) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      const routines = await db.collection("routines").find(req.query).toArray();
      res.json(routines);
      break;
    case "POST":
      const routine = JSON.parse(req.body);

      console.log(routine);

      // const added = await db.collection("routines").insertOne(routine);

      // added.insertedId ? res.status(201).end() : res.status(404).end();

      res.json({});

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
