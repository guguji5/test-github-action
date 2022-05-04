const {url} = require('./db');
const { MongoClient } = require("mongodb");

const client = new MongoClient(url);
async function run() {
  try {
    await client.connect();
    const database = client.db('stock');
    const movies = database.collection('stock');
    // Query for a movie that has the title 'Back to the Future'
    const query = { };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);