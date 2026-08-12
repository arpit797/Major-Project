const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");
const multer =require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});



router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);
// New routes
router.get("/new", isLoggedIn,listingController.renderNewForm);


// Search route
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.trim() === "") {
      return res.redirect("/listings");
    }

    const allListings = await Listing.find({
      $or: [
        { title:    { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { country:  { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    res.render("listings/index", {
      allListings,
      searchQuery: query,
      selectedCategory: null,
    });

  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong with the search.");
    res.redirect("/listings");
  }
});
// edit route
router.get("/:id/edit",
     isLoggedIn,
     isOwner,
     wrapAsync(listingController.renderEditForm)
    );
router.route("/:id")
.get(
    wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



module.exports=router;