const express = require("express");
const app = express();
const fs = require("fs");

const path = require("path");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    res.render("index.ejs", { files: files });
  });
});

app.get("/file/:fileName", (req, res) => {
  // there is we got a no response when we use fs.readFileSync
  fs.readFile(`./files/${req.params.fileName}`, "utf-8", (err, data) => {
    res.render("show", { data: data ,filename:req.params.fileName});
  });
});

app.get("/edit/:filename", (req, res) => {
    res.render("edit", {filename:req.params.filename});
 
});

app.post("/update", (req, res) => {
  fs.rename(
    `./files/${req.body.previous}`
    ,`./files/${req.body.new
      .split(" ")
      .map((val, ind) => {
        if (ind == 0) return val.toLowerCase();
        return val.charAt(0).toUpperCase() + val.slice(1);
      })
      .join("")}.txt`,
    (err) => {
      console.log("file was created successfully");
    }
  );
  res.redirect("/");
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title
      .split(" ")
      .map((val, ind) => {
        if (ind == 0) return val.toLowerCase();
        return val.charAt(0).toUpperCase() + val.slice(1);
      })
      .join("")}.txt`,
    req.body.details,
    (err) => {
      console.log("file was created successfully");
    }
  );
  res.redirect("/");
});
app.listen(3000, () => {
  console.log(`App is running on port 3000`);
});
