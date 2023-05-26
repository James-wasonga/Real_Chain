const express = require("express");
const { sendFile } = require("express/lib/response");
const path = require("path");
const fs = require("fs");
const fileUplaod = require("express-fileupload");
const app = express();
app.use(fileUplaod());

app.use(express.static(path.join(__dirname, "src")));
app.use(express.static(path.join(__dirname, "build")));
app.use("/images", express.static(__dirname + "/images"));
// app.use('/build/contracts', express.static(__dirname + '/contracts'))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/index.html"));
});

app.get("/abi.js", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/abi.js"));
});

app.get("/w3.css", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/w3.css"));
});

// app.get("/images", (req, res) => {
//     res.sendFile(path.join(__dirname, "/src/images/*"))
// })

app.post("/upload", (req, res) => {
  console.log(req.files);

  const { files } = req.files;
  // console.log(image);
  if (!files) return res.sendStatus(400);
  files.mv(__dirname + "/src/images/" + files.md5);

  const u = "/images/" + files.md5;
  res.send(u);
});

app.get("/web3.min.js", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/web3.min.js"));
});

const server = app.listen(5000);
const portNumber = server.address().port;
console.log(`server running at ${portNumber}`);
