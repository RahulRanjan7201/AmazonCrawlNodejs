const MongoClient = require("mongodb").MongoClient;
const dbConfig = {
  localhostDBUrl: "mongodb://localhost:27017/crawl-core",
  coreDB: "crawl-core"
};
let db;
let client;
const connect = async () => {
  if (!db) {
    console.log("establishing connection with mongodb.");
    client = await MongoClient.connect(dbConfig.localhostDBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 100000,
      connectTimeoutMS: 100000,
      keepAlive: true
    });
    db = client.db(dbConfig.coreDB);
    return db;
  }
  return db;
};

connect();

const getCollection = async function(collectionName) {
  db = await connect();
  return db.collection(collectionName);
};

const close = async () => {
  if (client) {
    await client.close();
    console.log(" connection closed. ");
  }
};
module.exports = { db, getCollection, close };
