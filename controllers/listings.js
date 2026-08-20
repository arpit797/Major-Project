const Listing = require("../models/listing");
const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
});

// INDEX
module.exports.index = async (req, res) => {
  const { category } = req.query;
  let filter = {};
  if (category) {
    filter.category = category;
  }
  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings, selectedCategory: category, searchQuery: null });
};

// RENDER NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW LISTING
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// CREATE LISTING
module.exports.createListing = async (req, res, next) => {
  try {
    let data = await geocoder.geocode(
      `${req.body.listing.location}, ${req.body.listing.country}`
    );

    const coords = (data && data.length > 0 && data[0].longitude && data[0].latitude)
      ? [data[0].longitude, data[0].latitude]
      : [77.2090, 28.6139];

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = {
      type: "Point",
      coordinates: coords,
    };

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Geocoding error:", err);
    req.flash("error", "Could not find location. Please try again.");
    res.redirect("/listings/new");
  }
};

// RENDER EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = typeof listing.image === "object" && listing.image && listing.image.url 
    ? listing.image.url 
    : (typeof listing.image === "string" ? listing.image : "");
  if (originalImageUrl && originalImageUrl.includes("/upload")) {
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  }

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// UPDATE LISTING
module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;

    let data = await geocoder.geocode(
      `${req.body.listing.location}, ${req.body.listing.country}`
    );

    const coords = (data && data.length > 0 && data[0].longitude && data[0].latitude)
      ? [data[0].longitude, data[0].latitude]
      : [77.2090, 28.6139];

    let listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    }, { new: true });

    listing.geometry = {
      type: "Point",
      coordinates: coords,
    };

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Geocoding error:", err);
    req.flash("error", "Could not update location. Please try again.");
    res.redirect("/listings");
  }
};

// DELETE LISTING
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};