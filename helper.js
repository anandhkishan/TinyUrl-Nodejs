const dbHost = process.env.DATABASE_HOST || "postgres";
const dbport = process.env.DATABASE_PORT || "5432";
const dbUser = process.env.DATABASE_USER || "postgres";
const dbName = process.env.DATABASE_NAME || "tiny_url";

const { Client } = require("pg");
const md5 = require("md5");
//SQL queries
const CREATE_TINY_URL_ENTRY =
  "INSERT INTO tiny_url(long_url,short_url) VALUES($1, $2) RETURNING short_url";
const GET_LONG_URL_BY_TINY_URL =
  "SELECT long_url from tiny_url WHERE short_url=$1";

const fetchRandomTextFromNumber = (generatedNumber) => {
  let shortText = "";
  const map = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  while (generatedNumber > 0) {
    shortText += map[generatedNumber % 62];
    generatedNumber /= 62;
    generatedNumber = Math.trunc(generatedNumber);
  }
  return shortText;
};

const shortenedRandomText = (longUrl) => {
  const hash = md5(longUrl);
  let hashInBinary = "";
  for (var i = 0; i < hash.length; i++) {
    hashInBinary += hash[i].charCodeAt(0).toString(2);
  }
  let generatedNumber = parseInt(hashInBinary.slice(0, 43), 2);
  return fetchRandomTextFromNumber(generatedNumber);
};

const convertToShortUrlAndSave = (longUrl) => {
  return new Promise((resolve, reject) => {
    console.log(
      "Db values: " + dbHost + ", " + dbName + ", " + dbUser + ", " + dbport
    );
    const tinyUrlPrefix = "https://aktiny.com/aurl/";
    const shortUrl = tinyUrlPrefix + shortenedRandomText(longUrl);
    const client = new Client({
      host: dbHost,
      user: dbUser,
      database: dbName,
      port: dbport,
    });
    client.connect();
    client.query(CREATE_TINY_URL_ENTRY, [longUrl, shortUrl], (err, res) => {
      if (err) {
        reject();
      } else {
        resolve(res.rows[0]);
      }
      client.end();
    });
    return tinyUrlPrefix;
  });
};

const getLongUrlByShortUrl = (shortUrl) => {
  return new Promise((resolve, reject) => {
    console.log(
      "Db values: " + dbHost + ", " + dbName + ", " + dbUser + ", " + dbport
    );

    const client = new Client({
      host: dbHost,
      user: dbUser,
      database: dbName,
      port: dbport,
    });
    client.connect();
    client.query(GET_LONG_URL_BY_TINY_URL, [shortUrl], (err, res) => {
      if (err) {
        reject();
      } else {
        console.log(res);
        resolve(res.rows[0]);
      }
      client.end();
    });
  });
};
module.exports = { convertToShortUrlAndSave, getLongUrlByShortUrl };
