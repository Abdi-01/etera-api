const mysql = require("mysql");
const db = mysql.createConnection({
  host: process.env.HOST,
  user: "fiqnh",
  password: "asd123",
  database: "etera_trade",
  port: 3306,
});

module.exports = db;
