const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

const findArticles = async () => {
  try {
    const articles = await Article.find();
    console.log(articles.map((article) => article.title));
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.send("Hello");
  findArticles();
});

app.listen(3000, () => {
  console.log("speak chief, I'm listening on port 3000");
});
