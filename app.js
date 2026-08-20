require("dotenv").config();

const express = require("express");
const app = express();

app.set("trust proxy", 1);
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const localDbUrl = "mongodb://127.0.0.1:27017/wanderlust";
const atlasUrl = process.env.ATLASDB_URL;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection.getClient();
    }
    const urlsToTry = [
        process.env.NODE_ENV === "production" ? atlasUrl : localDbUrl,
        atlasUrl,
        localDbUrl
    ].filter(Boolean);

    for (const url of urlsToTry) {
        try {
            const conn = await mongoose.connect(url, { serverSelectionTimeoutMS: 5000 });
            console.log("Connected to MongoDB:", url.includes("127.0.0.1") ? "Local DB" : "Atlas DB");
            return conn.connection.getClient();
        } catch (err) {
            console.warn(`Connection failed for ${url.includes("127.0.0.1") ? "Local DB" : "Atlas DB"}: ${err.message}`);
        }
    }
    console.error("Could not connect to any MongoDB database.");
}

const clientPromise = connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const storeConfig = {
    crypto: {
        secret: process.env.SECRET || "mysupersecretcode",
    },
    touchAfter: 24 * 3600,
};

if (atlasUrl) {
    storeConfig.mongoUrl = atlasUrl;
} else {
    storeConfig.clientPromise = clientPromise;
}

const store = MongoStore.create(storeConfig);

store.on("error", (err) => console.error("SESSION STORE ERROR:", err));

app.use(session({
    store,
    secret: process.env.SECRET || "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.locals.success = res.locals.success || [];
    res.locals.error = res.locals.error || [];
    res.status(statusCode).render("error.ejs", { message, statusCode });
});

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;