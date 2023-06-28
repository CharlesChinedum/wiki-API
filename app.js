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

// const findArticles = async () => {
//   try {
//     const articles = await Article.find();
//     return articles;
//   } catch (error) {
//     console.log(error);
//   }
// };

//Request targeting all articles

app
  .route("/articles")

  .get(async (req, res) => {
    try {
      const articles = await Article.find();
      res.send(articles);
    } catch (error) {
      res.send(error);
    }
  })

  .post(async (req, res) => {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
      });
      await newArticle.save();
      res.send("Successfully added a new article");
      console.log(newArticle);
    } catch (error) {
      res.send(error);
    }
  })

  .delete(async (req, res) => {
    try {
      await Article.deleteMany();
      res.send("Successfully deleted all articles");
    } catch (error) {
      res.send(error);
    }
  });

//Requests targetting a specific Article

app
  .route("/articles/:articleTitle")

  .get((req, res) => {
    async function findArticle() {
      const article = await Article.findOne({ title: req.params.articleTitle });
      if (article) {
        return article;
      } else {
        return "not found";
      }
    }

    findArticle().then((result) => {
      res.send(result);
    });
  })

  .put(async (req, res) => {
    try {
      await Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content },
        { overwrite: true }
      );
      res.send("Successfully updated article");
    } catch (err) {
      res.status(500).send("Error updating article");
    }
  })

  .patch(async (req, res) => {
    try {
      await Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { $set: req.body }
      );
      res.send("Successfully updated article");
    } catch (error) {
      res.send(error);
    }
  })

  .delete(async (req, res) => {
    try {
      await Article.deleteOne({ title: req.params.articleTitle });
      res.send("Successfully deleted all articles");
    } catch (error) {
      res.send(error);
    }
  });

//Spin up server
app.listen(3000, () => {
  console.log("speak chief, I'm listening on port 3000");
});
