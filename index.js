import express from "express";
import cors from "cors";
import 'dotenv/config'
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3001;



const client = new MongoClient(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-bqzlc8s-shard-00-00.6my06uv.mongodb.net:27017,ac-bqzlc8s-shard-00-01.6my06uv.mongodb.net:27017,ac-bqzlc8s-shard-00-02.6my06uv.mongodb.net:27017/?ssl=true&replicaSet=atlas-14p3me-shard-0&authSource=admin`);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient = await connectToMongoDB();

 const database = connectedClient.db("loopAdmin");
  const users = database.collection("user");
  const jobs = database.collection("jobs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const cursor = users.find({});
  const results = await cursor.toArray();
  res.json(results);

});

app.get("/jobs", async (req, res) => {
  const cursor = jobs.find({});
  const results = await cursor.toArray();
  res.json(results);
});

app.post("/jobs", async (req, res) => {
  try {
    const job = req.body;
    if (!job.title || !job.companyName) {
      return res.status(400).json({ error: "title and companyName are required" });
    }
    const result = await jobs.insertOne({ ...job, status: "open", createdAt: new Date() });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to save the job" });
  }
});

app.delete("/jobs/:id", async (req, res) => {
  try {
    const result = await jobs.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete the job" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

