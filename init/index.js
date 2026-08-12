const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const categories = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic"];

function getCategory(obj, index) {
  if (obj.category) return obj.category;
  const title = (obj.title || "").toLowerCase();
  if (title.includes("mountain") || title.includes("cabin") || title.includes("chalet")) return "Mountains";
  if (title.includes("city") || title.includes("loft") || title.includes("penthouse") || title.includes("apartment")) return "Iconic Cities";
  if (title.includes("villa") || title.includes("pool") || title.includes("resort") || title.includes("beach")) return "Amazing Pools";
  if (title.includes("treehouse") || title.includes("tent") || title.includes("camping")) return "Camping";
  if (title.includes("castle") || title.includes("historic") || title.includes("mansion")) return "Castles";
  if (title.includes("farm") || title.includes("cottage") || title.includes("ranch")) return "Farms";
  if (title.includes("ski") || title.includes("arctic") || title.includes("snow") || title.includes("igloo")) return "Arctic";
  if (title.includes("room") || title.includes("suite") || title.includes("studio")) return "Rooms";
  return categories[index % categories.length];
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj, index) => ({
    ...obj,
    owner: "69cbe52f1dc3735a43d4c36a",
    category: getCategory(obj, index),
    image: typeof obj.image === "string" ? { url: obj.image, filename: "listingimage" } : obj.image,
    geometry: obj.geometry || {
      type: "Point",
      coordinates: [77.2090, 28.6139],
    },
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized with categories");
};

initDB();