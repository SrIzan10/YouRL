//web framework
const express = require("express");

//create basic app
const app = express();

//setting ejs as view engine
app.set("view engine", "ejs");

// tell express, app is using url parameters
app.use(express.urlencoded({ extended: false }));

// to connect to database
const mongoose = require("mongoose");

//App deploy or localhost mode connection to MongoDB
const mongooseURI = "mongodb+srv://database:dbyessir@cruzasj.dbvjm.mongodb.net/db"
if (!mongooseURI) throw new Error("No mongooseURI variable found.");
mongoose
    .connect(mongooseURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB (mongoose) connected."));

// import data model/ schema
const ShortUrl = require("./models/shortUrl");

//get
// index page with request and response parameters
// show all url from table "ShortUrl" in index page
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

//post
app.post("/shortUrls", async (req, res) => {
  ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

//for clicking on short url after slash
//parameter ":shortUrl"
app.get("/:shortUrl", async (req, res) => {
  //find the one where in "short", a "shortUrl" is found
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  //if user sends empty shorturl,send 404
  if (shortUrl == null) return res.sendStatus(404);

  //otherwise increase the click
  shortUrl.clicks++;
  //save the changes in table
  //can use `await` here but speed of redirect is more important
  await shortUrl.save();

  //redirect the full link corresponding the short url we found
  res.redirect(shortUrl.full);
});

// start listening on specified port 4567
//can set as environment var
app.listen(process.env.PORT || 4567);
