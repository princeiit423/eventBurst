const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const Event = require("./models/event.js");
const upcomingevent = require("./models/upcomingevent.js");
const Attendance = require("./models/attendance.js");
const userregister = require("./models/userregister.js");
const winner = require("./models/winner.js");
const component = require("./models/components.js");
const review = require("./models/review.js");
const isLoggedIn = require("./login_middleware.js");
const MongoStore = require("connect-mongo");
const sendmail = require("./sendmail_middleware.js");
const isAdmin = require("./isAdmin_middleware.js");
const methodOverride = require("method-override");
const flash = require("connect-flash");

const multer = require("multer");
const { storage } = require("./cloudConfig.js");

const upload = multer({ storage });

require("dotenv").config();
const port = process.env.PORT || 4000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
//app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));

try {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connected to DB");
} catch (error) {
  console.log("error", error.message);
}

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.logout= req.flash("logout");
  res.locals.signup= req.flash("signup");
  next();
});

app.get("/", async (req, res, next) => {
  try {
    const admi = req.user || null;

    const events = await upcomingevent.find().sort({ dateOfEvent: -1 }).limit(6);
    const winners = await winner.find().sort({ _id: -1 }).limit(1);   
    res.render("home/home1.ejs", { admi, winners, events });
  } catch (err) {
    next(err);
  }
});

// signup login logout route

app.get("/signup", (req, res) => {
  const admi = req.user || null;
  res.render("signup/signup1.ejs", { admi });
});

app.post("/signup", async (req, res, next) => {
  try {
    let { username, email, password, fullname, branch, roll, semester, year } =
      req.body;
    const newUser = new User({
      username,
      email,
      fullname,
      roll,
      semester,
      year,
      branch,
    });

    const registerUser = await User.register(newUser, password);
    await registerUser.save();

    //functionality to directly login after signup
    req.login(registerUser, async (err) => {
      if (err) {
        return next(err);
      }
      try {
        const winners = await winner.find().sort({ _id: -1 }).limit(1);
        const events = await upcomingevent.find().sort({ _id: -1 }).limit(6);
        const admi = req.user || null;
        req.flash("signup", "Signup Successfully");
        res.render("home/home1.ejs", { winners, admi, events , signup: req.flash("signup")});
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    // Pass any other errors to the error handler
    next(err);
  }
});

// show profile detail route
app.get("/signup/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const profile = await User.findById(id);
    res.render("test/profile.ejs", { profile });
  } catch (err) {
    next(err);
  }
});

app.get("/login", (req, res) => {
  const admi = req.user || null;
  res.render("login/login1.ejs", { admi });
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  async (req, res,next) => {
    try {
      const winners = await winner.find().sort({ _id: -1 }).limit(1);
      const events = await upcomingevent.find().sort({ _id: -1 }).limit(6);
      const admi = req.user || null;
      req.flash("success", "Login Successfully");
      res.render("home/home1.ejs", { winners, admi, events, success: req.flash("success") });
    } catch (err) {
      next(err);
    }
  }
);

app.get("/logout", (req, res, next) => {
  req.logout(async (err) => {
    if (err) {
      return next(err);
    } else {
      const winners = await winner.find().sort({ _id: -1 }).limit(1);
      const events = await upcomingevent.find().sort({ _id: -1 }).limit(6);
      const admi = req.user || null;
      req.flash("logout", "Logout Successfully");
      return res.render("home/home1.ejs", { winners, admi, events , logout: req.flash("logout")});
    }
  });
});

//all event fetch route

app.get("/featured1", (req, res, next) => {
  try {
    const admi = req.user || null;
    res.render("featured/featured1.ejs", { admi });
  } catch (err) {
    next(err);
  }
});

app.get("/featured2", (req, res, next) => {
  try {
    const admi = req.user || null;
    res.render("featured/featured2.ejs", { admi });
  } catch (err) {
    next(err);
  }
});

app.get("/featured3", (req, res, next) => {
  try {
    const admi = req.user || null;
    res.render("featured/featured3.ejs", { admi });
  } catch (err) {
    next(err);
  }
});

app.get("/featured4", (req, res, next) => {
  try {
    const admi = req.user || null;
    res.render("featured/featured4.ejs", { admi });
  } catch (err) {
    next(err);
  }
});

app.get("/pastEvent", isLoggedIn, async (req, res, next) => {
  try {
    const allEvent = await Event.find().sort({ _id: -1 });
    const admi = req.user || null;
    res.render("pastevent/pastevent.ejs", { allEvent, admi });
  } catch (err) {
    next(err);
  }
});
app.get("/pastEvent/:id", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const username = req.user.username;
    const singleEvent = await Event.findById(id);
    const admi = req.user || null;
    res.render("showpastevent/showpastevent.ejs", {
      singleEvent,
      username,
      admi,
    });
  } catch (err) {
    next(err);
  }
});
app.delete("/pastEvent/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    await Event.findByIdAndDelete(id);
    res.redirect("/pastevent");
  } catch (err) {
    next(err);
  }
});

app.get("/admin/pasteventform", (req, res, next) => {
  try {
    const admi = req.user || null;
    res.render("addpastevent/addpastevent.ejs", { admi });
  } catch (err) {
    next(err);
  }
});

app.post("/addpastevent", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const { title, description, posterUrl, eventUrl, dateOfEvent, location } =
      req.body;
    const newPastEvent = await new Event({
      title,
      description,
      posterUrl,
      eventUrl,
      dateOfEvent,
      location,
    });
    await newPastEvent.save();
    res.redirect("/pastevent");
  } catch (err) {
    next(err);
  }
});

app.get("/addevent", isLoggedIn, isAdmin, (req, res, next) => {
  try {
    const admi = req.user || null;
    res.render("addevent/addevent.ejs", { admi });
  } catch (err) {
    next(err);
  }
});

app.post("/addevent", isAdmin, async (req, res, next) => {
  try {
    const {
      title,
      description,
      posterUrl,
      dateOfEvent,
      location,
      club,
      entryFee,
    } = req.body;
    const newEvent = new upcomingevent({
      title,
      description,
      posterUrl,
      dateOfEvent,
      location,
      club,
      entryFee,
    });
    await newEvent.save();
    res.redirect("/admin");
  } catch (err) {
    next(err);
  }
});

app.get("/upcomingevent", isLoggedIn, async (req, res, next) => {
  try {
    const allupcomingEvent = await upcomingevent.find().sort({ dateOfEvent: -1 });
    const admi = req.user || null;
    res.render("upcomingevent/upcomingevent.ejs", { allupcomingEvent, admi });
  } catch (err) {
    next(err);
  }
});

app.get("/upcomingevent/:id", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const username = req.user.username;
    const userId = req.user._id;
    const singleEvent = await upcomingevent
      .findById(id)
      .populate({ path: "reviews", populate: { path: "author" } });
    const fee = singleEvent.entryFee;
    const admi = req.user || null;
    res.render("showevent/showevent.ejs", {
      singleEvent,
      username,
      admi,
      fee,
      userId,
    });
  } catch (err) {
    next(err);
  }
});

app.delete(
  "/upcomingevent/:id",
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      await upcomingevent.findByIdAndDelete(id);
      res.redirect("/admin");
    } catch (err) {
      next(err);
    }
  }
);

app.post("/upcomingevent/:id/review", isLoggedIn, async (req, res, next) => {
  try {
    const event = await upcomingevent.findById(req.params.id);
    const { comment, reviews } = req.body;
    const newReview = new review({ comment, reviews });
    newReview.author = req.user._id;
    event.reviews.push(newReview);

    await newReview.save();
    await event.save();
    res.redirect(`/upcomingevent/${event._id}`);
  } catch (err) {
    next(err);
  }
});

app.delete("/upcomingevent/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    await upcomingevent.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/upcomingevent/${id}`);
  } catch (err) {
    next(err);
  }
});

app.get("/upcomingevent/:id/register", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const admi = req.user || null;
    const singleEvent = await upcomingevent.findById(id);
    res.render("eventregistration/eventregistration.ejs", {
      singleEvent,
      admi,
    });
  } catch (err) {
    next(err);
  }
});

app.get(
  "/upcomingevent/:id/register-free",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const admi = req.user || null;
      const singleEvent = await upcomingevent.findById(id);
      res.render("eventregistration/eventregistration-free.ejs", {
        singleEvent,
        admi,
      });
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  "/upcomingevent/:id/register",
  isLoggedIn,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const txnId = await userregister.findOne({ txn: req.body.txn });
      if (txnId) {
        return res
          .status(400)
          .send("Transaction Id is already used, please check once");
      }

      const url = req.file.path;
      const filename = req.file.filename;

      const id = req.params.id;
      const singleEvent = await upcomingevent.findById(id);

      const admi = req.user || null;
      const { name, department, roll, semester, email, txn, whatsapp } =
        req.body;
      const newregister = await new userregister({
        name,
        department,
        roll,
        semester,
        email,
        txn,
        whatsapp,
      });
      newregister.image = { url, filename };
      singleEvent.userregister.push(newregister);
      const userId = req.user._id;
      const user = await User.findById(userId);
      user.event.push(singleEvent);

      await newregister.save();
      await singleEvent.save();
      await user.save();

      res.render("successfull/success.ejs", { newregister, singleEvent, admi });
      next();
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  "/upcomingevent/:id/register-free",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const singleEvent = await upcomingevent.findById(id);

      const admi = req.user || null;
      const { name, department, roll, semester, email, whatsapp } = req.body;
      const newregister = await new userregister({
        name,
        department,
        roll,
        semester,
        email,
        whatsapp,
      });
      singleEvent.userregister.push(newregister);
      const userId = req.user._id;
      const user = await User.findById(userId);
      user.event.push(singleEvent);

      await newregister.save();
      await singleEvent.save();
      await user.save();

      res.render("successfull/success.ejs", { newregister, singleEvent, admi });
      next();
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/upcomingevent/:id/participation",
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const participation = await upcomingevent
        .findById(id)
        .populate("userregister");
      participation.userregister.sort((a, b) => b.date - a.date);
      res.render("participation/participation.ejs", { participation });
    } catch (err) {
      next(err);
    }
  }
);

app.get("/admin", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await upcomingevent.countDocuments();
    const totalComponents = await component.countDocuments();
    const totalPastEvents = await Event.countDocuments();
    const totalECEian = await winner.countDocuments();
    const finalEvents = totalEvents + totalPastEvents;
    const totalVisit = await Attendance.countDocuments();
    res.render("admin/admin.ejs", {
      totalUsers,
      totalEvents,
      totalComponents,
      totalPastEvents,
      totalECEian,
      finalEvents,
      totalVisit,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/admin/winner", isLoggedIn, isAdmin, (req, res, next) => {
  try {
    const admi = req.user || null;
    res.render("addeceian/addeceian.ejs", { admi });
  } catch (err) {
    next(err);
  }
});
app.post("/admin/winner", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const { name, department, imageUrl, semester, year, roll } = req.body;
    const newWinner = await new winner({
      name,
      department,
      imageUrl,
      semester,
      year,
      roll,
    });
    await newWinner.save();
    res.redirect("/admin");
  } catch (err) {
    next(err);
  }
});

app.delete("/admin/winner/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const ID= req.params.id;
    await winner.findByIdAndDelete(ID);
    res.redirect("/winner");
  } catch (err) {
    next(err);
  }
});

app.get("/admin/attendance", isLoggedIn, isAdmin, (req, res, next) => {
  try {
    const admi = req.user || null;
    res.render("attendance/attendance.ejs", { admi });
  } catch (err) {
    next(err);
  }
});

app.post("/save", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const { name, department, entryTime, exitTime, purposeOfVisiting } =
      req.body;
    const addEntry = new Attendance({
      name,
      department,
      entryTime,
      exitTime,
      purposeOfVisiting,
    });
    await addEntry.save();
    const admi = req.user || null;
    res.render("attendance/attendance.ejs", { admi });
  } catch (err) {
    next(err);
  }
});

app.get("/records", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const admi = req.user || null;
    const attendanceRecords = await Attendance.find().sort({ date: -1 }); // Sort by date in descending order
    res.render("records/records.ejs", { attendanceRecords, admi });
  } catch (err) {
    next(err);
  }
});
app.get("/winner",isLoggedIn, async (req, res, next) => {
  try {
    const admi = req.user || null;
    const winners = await winner.find().sort({ _id: -1 });
    res.render("eceian/ecian.ejs", { winners, admi });
  } catch (err) {
    next(err);
  }
});

app.get("/profile", isLoggedIn, async (req, res) => {
  const user = req.user;
  const data = await User.findById(req.user._id).populate("event");
  const admi = req.user || null;
  res.render("profile/profile.ejs", { user, admi, data });
});

app.get("/admin/addcomponent", isLoggedIn, isAdmin, (req, res) => {
  res.render("addcomponent/addcomponent.ejs");
});

app.post("/addcomponent", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const { component_name, quantity, available, imageUrl } = req.body;
    const newComponent = await new component({
      component_name,
      quantity,
      available,
      imageUrl,
    });
    newComponent.save();
    res.redirect("/admin");
  } catch (err) {
    next(err);
  }
});
app.get("/listofcomponent", async (req, res, next) => {
  try {
    const list = await component.find({});
    res.render("listofcomponent/listofcomponent.ejs", { list });
  } catch (err) {
    next(err);
  }
});
app.get("/contact", (req, res, next) => {
  try {
    const admi = req.user || null;
    res.render("contact/contact.ejs", { admi });
  } catch (err) {
    next(err);
  }
});

app.get("/leaderboard", async (req, res, next) => {
  try {
    const quote = [
      "Builder",
      "Learner",
      "Master",
      "Achievers",
      "Hardworker",
      "Unbeatable",
      "Inspire",
      "Empower",
      "Achieve",
      "Conquer",
      "Thrive",
      "Create",
      "Persist",
      "Elevate",
      "Focus",
      "Believe",
      "Dream",
      "Courage",
      "Innovate",
      "Succeed",
      "Excel",
    ];
    const randQuote = () => {
      return quote[Math.floor(Math.random() * quote.length)];
    };
    const winnersList = await winner.aggregate([
      {
        $group: {
          _id: "$roll", // Group by the name field
          winCount: { $sum: 1 }, // Count the number of wins
          department: { $first: "$department" }, // Include department for context
          imageUrl: { $first: "$imageUrl" }, // Include image URL for context
          name: { $first: "$name" }, // Include name for context
          sem: { $first: "$semester" }, // include semester
        },
      },
      {
        $sort: { winCount: -1 }, // Sort by win count in descending order
      },
    ]);
    // Add random quotes to each winner
    winnersList.forEach((winner) => {
      winner.quote = randQuote();
    });
    const admi = req.user || null;
    res.render("leaderboard/leaderboard.ejs", { winnersList, admi });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.render("error/err.ejs", { err });
});

app.listen(port, (req, res) => {
  console.log(`server is running on port:${port}`);
});
