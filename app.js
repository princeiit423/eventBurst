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
const userregister= require("./models/userregister.js");
const winner= require("./models/winner.js");
const component=require("./models/components.js");
const isLoggedIn= require("./login_middleware.js");
const MongoStore = require('connect-mongo');
const sendmail= require("./sendmail_middleware.js");
const isAdmin = require("./isAdmin_middleware.js");
const methodOverride= require("method-override");

require("dotenv").config();
const port = process.env.PORT||4000;


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
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

const store= MongoStore.create({
  mongoUrl:process.env.DB_URL,
  crypto:{
    secret:process.env.SECRET
  }, 
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next()
})

app.get("/", async (req, res,next) => {
  try {
    const user= req.user ||null;
    
  const winners = await winner.find().sort({_id:-1}).limit(1);
  res.render("home/home1.ejs",{user,winners});
  } catch (err) {
    next(err);
  }

});



// signup login logout route

app.get("/signup", (req, res) => {
  res.render("signup/signup1.ejs");
});


app.post("/signup", async (req, res, next) => {
  try {
    let { username, email, password, fullname, branch, roll, semester, year } = req.body;

    // Check if a user already exists with the same username
   // const existingUser = await User.findOne({ username });
   // if (existingUser) {
   //   return res.status(400).send('A user with the given username already exists.');
   // }

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

    const winners = await winner.find().sort({ _id: -1 }).limit(1);
    res.render("home/home1.ejs", { winners });

  } catch (err) {
    
      // Pass any other errors to the error handler
      next(err);
  }
});


// show profile detail route
app.get("/signup/:id", async (req, res,next) => {
 try {
  const id = req.params.id;
  const profile = await User.findById(id);
  res.render("test/profile.ejs", { profile });
 } catch (err) {
    next(err);
 }
});

app.get("/login", (req,res)=>{
  res.render("login/login1.ejs");
})

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  async (req, res) => {
      try {
        const winners = await winner.find().sort({_id:-1}).limit(1);
        res.render("home/home1.ejs",{winners});
      } catch (err) {
        next(err);
      }
  }
);



app.get("/logout", (req, res, next) => {
  req.logout(async(err) => {
    if (err) {
      return next(err);
    } else {
      const winners = await winner.find().sort({_id:-1}).limit(1);
      return res.render("home/home1.ejs",{winners});
    }
  });
});

//all event fetch route

app.get("/pastEvent", isLoggedIn, async (req, res,next) => {
  try {
    const allEvent = await Event.find({});
    res.render("pastevent/pastevent.ejs", { allEvent });
  } catch (err) {
    next(err);
  }
});
app.get("/pastEvent/:id",isLoggedIn, async(req,res,next)=>{
  try {
    const id = req.params.id;
  const username=req.user.username;
  const pastEvent=await Event.findById(id);
  res.render("showpastevent/showpastevent.ejs", {pastEvent,username});
  } catch (err) {
    next(err);
  }
})
app.delete("/pastEvent/:id", async(req,res,next)=>{
  try {
    const id= req.params.id;
  await Event.findByIdAndDelete(id);
  res.redirect("/pastevent");
  } catch (err) {
    next(err);
  }
})

app.get("/admin/pasteventform", (req,res)=>{
  res.render("addpastevent/addpastevent.ejs");
})

app.post("/addpastevent",isLoggedIn,isAdmin, async(req,res,next)=>{
  try {
    const {title,description,posterUrl,eventUrl, dateOfEvent,location}= req.body;
  const newPastEvent= await new Event({title,description,posterUrl,eventUrl,dateOfEvent,location});
  await newPastEvent.save();
  res.redirect("/pastevent");
  } catch (err) {
    next(err);
  }
})

app.get("/addevent",isLoggedIn,isAdmin,(req, res) => {
  res.render("addevent/addevent.ejs");
});

app.post("/addevent",isAdmin, async (req, res,next) => {
  try {
    const { title, description, posterUrl, dateOfEvent, location, club } =
    req.body;
  const newEvent = new upcomingevent({
    title,
    description,
    posterUrl,
    dateOfEvent,
    location,
    club,
  });
  await newEvent.save();
  res.redirect("/admin");
  } catch (err) {
    next(err);
  }
});


app.get("/upcomingevent",isLoggedIn, async (req, res,next) => {
    try {
      const allupcomingEvent = await upcomingevent.find().sort({_id:-1});
      res.render("upcomingevent/upcomingevent.ejs", { allupcomingEvent });
    } catch (err) {
      next(err);
    }
});

app.get("/upcomingevent/:id",isLoggedIn, async(req,res,next)=>{
      try {
        const id= req.params.id;
        const username= req.user.username;
        const singleEvent=await upcomingevent.findById(id);
        res.render("showevent/showevent.ejs",{singleEvent,username});
      } catch (err) {
        next(err);
      }
})

app.delete("/upcomingevent/:id", async(req,res,next)=>{
  try {
    const id = req.params.id;
   await upcomingevent.findByIdAndDelete(id);
   res.redirect("/admin");
  } catch (err) {
    next(err);
  }

})

app.get("/upcomingevent/:id/register", isLoggedIn,async(req,res,next)=>{
  try {
    const id = req.params.id;
    const singleEvent= await upcomingevent.findById(id);
    res.render("eventregistration/eventregistration.ejs",{singleEvent});
  } catch (err) {
      next(err);
  }
})

app.post("/upcomingevent/:id/register",isLoggedIn, async(req,res,next)=>{
  try {
    const id = req.params.id;
  const singleEvent= await upcomingevent.findById(id);
  const {name,department,roll,semester,email}= req.body;
  const newregister= await new userregister({name,department,roll,semester,email});
  singleEvent.userregister.push(newregister);
  await newregister.save();
  await singleEvent.save();

   res.render("successfull/success.ejs",{newregister , singleEvent});
   next();
  } catch (err) {
    next(err);
  }
})

app.get("/upcomingevent/:id/participation", isLoggedIn,isAdmin, async(req,res,next)=>{
 try {
  const id= req.params.id;
  const participation=await upcomingevent.findById(id).populate("userregister");
  res.render("participation/participation.ejs",{participation});
 } catch (err) {
    next(err);
 }
})


app.get("/admin",isLoggedIn,isAdmin,(req,res)=>{
    res.render("admin/admin.ejs");
  }
)

app.get("/admin/winner",isLoggedIn,isAdmin,(req,res)=>{
  res.render("addeceian/addeceian.ejs");
})
app.post("/admin/winner",isLoggedIn,isAdmin, async(req,res,next)=>{
  try {
    const{name,department,imageUrl,semester,year}= req.body;
  const newWinner = await new winner({name,department,imageUrl,semester,year});
  await newWinner.save();
  res.redirect("/admin");
  } catch (err) {
    next(err);
  }
})
app.get("/winner", async(req,res,next)=>{
 try {
  const winners = await winner.find().sort({_id:-1});
  res.render("eceian/ecian.ejs", {winners});
 } catch (err) {
    next(err);
 }
})

app.get("/profile",isLoggedIn, async(req,res)=>{
  const user= req.user;
  res.render("profile/profile.ejs",{user});
})

app.get("/admin/addcomponent",isLoggedIn,isAdmin,(req,res)=>{
  res.render("addcomponent/addcomponent.ejs")
})

app.post("/addcomponent",isLoggedIn,isAdmin,async(req,res,next)=>{
  try {
    const {component_name,quantity,available,imageUrl}=req.body;
  const newComponent=await new component({component_name,quantity,available,imageUrl});
  newComponent.save();
  res.redirect("/admin");
  } catch (err) {
    next(err);
  }
})
app.get("/listofcomponent",async(req,res,next)=>{
  try {
    const list= await component.find({});
  res.render("listofcomponent/listofcomponent.ejs",{list});
  } catch (err) {
    next(err);
  }
  
})
app.get("/contact",(req,res)=>{
  res.render("contact/contact.ejs");
})


app.use((err, req, res, next) => {
  res.render("error/err.ejs",{err});
});

app.listen(port, (req, res) => {
  console.log(`server is running on port:${port}`);
});
