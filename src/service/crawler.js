const axios = require("axios");
const cheerio = require("cheerio");
const client = require("../config/redisSetup");
const { getCollection } = require("../config/db");
const crawlerService = {
  getProductDetails: async () => {
    let collection = await getCollection("productDetails");
    return await collection.find({}).toArray();
  },
  extractData: async data => {
    let dataArray = [];
    const $ = cheerio.load(data);
    $(".s-asin").each(async (i, el) => {
      const id = $(el).attr("data-asin");
      const key = $(el)
        .find("h2 span")
        .text();
      const price = $(el)
        .find(".a-price-whole")
        .text();
      const rating = $(el)
        .find(".a-spacing-top-micro span")
        .attr("aria-label");
      const image = $(el)
        .find(".s-image")
        .attr("src");
      const link =
        "https://www.amazon.in" +
        $(el)
          .find(".a-link-normal")
          .attr("href");
      const datas = { id, key, price, rating, image, link };
      dataArray.push(datas);
    });
    await crawlerService.verifyAndSaveResult(dataArray);
    console.log("Done..............");
  },
  makeRequest: async keyword => {
    axios
      .get(`https://www.amazon.in/s?k=${keyword}&ref=nb_sb_noss}`)
      .then(response => {
        crawlerService.extractData(response.data);
      });
  },
  async verifyAndSaveResult(data) {
    for (let i = 0; i < data.length; i++) {
      redisKey = data[i].key;
      try {
        client.get(redisKey, async (err, key) => {
          if (key) {
            console.log("Key is Present in DBs");
          } else {
            console.log("key is not present........");
            client.setex(redisKey, 3600, JSON.stringify(data[i]));
            let collection = await getCollection("productDetails");
            await collection.insertOne(data[i]);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
};

module.exports = crawlerService;
