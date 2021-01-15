const helper = require("./helper");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { response } = require("express");
const BACKEND_PREFIX = "/app";
const CREATE_PATH = BACKEND_PREFIX + "/create";
const STATUS_CHECK = BACKEND_PREFIX + "/status";

const port = 5000;
const app = express();
app.use(cors());
// const hash = md5("example.com/djfnjdvf/dfvdfvdfv1231231231231")
// console.log(hash);
// console.log(hash.length);
// console.log(hash[0].charCodeAt(0).toString(2))
// let hashbinary = "";
// for (var i = 0; i < hash.length; i++) {
//      hashbinary += hash[i].charCodeAt(0).toString(2);
// }

// let hash43Binary = hashbinary.slice(0,43);
// console.log("Hash binary 43 bits:",hash43Binary);
// let decimalVal = parseInt(hash43Binary,2);
// console.log(decimalVal);

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/*
    Sample Request Payload:
    {
        "long_url":"https://sample.com"
    }

    Sample Response Payload:
    {
        "short_url":"https://s.com"
    }
*/
app.post(CREATE_PATH, (req, res) => {
  console.log("Got the request", req.body);
  const reqBody = req.body;
  const longUrl = reqBody["long_url"];
  console.log(longUrl);
  helper
    .convertToShortUrlAndSave(longUrl)
    .then((response) => {
      res.setHeader("Content-Type", "application/json");
      const shortURL =
        process.env.HOST + BACKEND_PREFIX + "/" + response["short_url"];
      res.json({ short_url: shortURL });
      res.end();
    })
    .catch(() => {
      handleInternalServerError(res);
    });
});

app.get(BACKEND_PREFIX + "/*", (req, res) => {
  console.log(req.query);
  const shortUrl = req.path.split("/app/")[1];
  helper
    .getLongUrlByShortUrl(shortUrl)
    .then((response) => {
      res.setHeader("location", response["long_url"]);
      res.status(302);
      res.end();
    })
    .catch(() => {
      handleInternalServerError(res);
    });
});

app.get(STATUS_CHECK, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({ status: "ok" });
  res.status(200);
  res.end();
});
app.listen(port, () => {
  console.log(`Started the server and listening in port ${port}!!!`);
});

function handleInternalServerError(res) {
  res.status(500).send("Failed!!!");
  res.end();
}
