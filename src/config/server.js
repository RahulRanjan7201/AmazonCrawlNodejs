require("./db");
require("./redisSetup");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const crawlerService = require("../service/crawler");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get("/", (req, res) => {
  res.send("Invalid endpoint");
});
app.post("/process_detail/:keyword", urlencodedParser, async (req, res) => {
  try {
    await crawlerService.makeRequest(req.params.keyword);
    req.json({ message: "details fetched and saved successfully" });
  } catch (err) {
    console.log("Error" + err);
    res.json({ message: "something went wrong in server" });
  }
});
app.get("/process_detail", urlencodedParser, async (req, res) => {
  try {
    const data = await crawlerService.getProductDetails();
    res.json(data);
  } catch (err) {
    console.log("Error" + err);
    res.json({ message: "something went wrong in server" });
  }
});
const server = app.listen(8085, "127.0.0.1", res => {
  console.log("Server started successfully in " + 8085);
});
