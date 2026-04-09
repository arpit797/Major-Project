const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected to DB");
}

main();

const initDB = async () => {
  await Listing.deleteMany({});

  const modifiedData = initData.data.map((obj) => ({
    ...obj,
    owner: "69cbe52f1dc3735a43d4c36a",
    image: {
      url: obj.image,
      filename: "default",
    },
  }));

  await Listing.insertMany(modifiedData);
  console.log("data was initialized");
};

initDB();