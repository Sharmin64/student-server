const express = require("express");
const app = express();
const cors = require("cors");

const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xol1uc7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const studentCollection = client.db("management").collection("student");

    app.get("/student", async (req, res) => {
      const search = req.query.search;
      const query = {name: {$regex: search, $options: "i"}};
      console.log(search);
      const result = await studentCollection.find(query).toArray();

      res.send(result);
    });

    //app.get("/student/person/search/:term", async (req, res) => {
    //  const searchTerm = req.params.term;
    //  console.log(req.params.term);
    //  try {
    //    const person = await client.db
    //      .studentCollection("person")
    //      .find({
    //        name: {$regex: new RegExp(searchTerm, "i")},
    //      })
    //      .toArray();
    //    res.json(person);
    //  } catch (error) {
    //    console.error("Error searching person:", error);
    //    res.status(500).json({error: "Internal Server Error"});
    //  }
    //});

    app.post("/student/:id", async (req, res) => {
      const student = req.body;

      const result = await studentCollection.insertOne(student);

      res.send(result);
    });

    app.delete("/student/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await studentCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ping: 1});
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("student management is done");
});

app.listen(port, () => {
  console.log(`Student Server is Running on ${port}`);
});
