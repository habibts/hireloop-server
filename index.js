import express from "express";
import cors from "cors";
import 'dotenv/config'
import { MongoClient } from "mongodb";

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
