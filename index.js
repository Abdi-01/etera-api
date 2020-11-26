const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const bearerToken = require("express-bearer-token");
const PORT = process.env.PORT;
const cors = require("cors");
const moment = require("moment");
const { user_router, packing_router, dbstock_router } = require("./router");
const { getMessage } = require("./wa server/index");

const fs = require("fs");
const client = require("./client");
const { waServer } = require("./wa server/index");

var app = express();
app.use(bodyParser.json());
app.use(bearerToken());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
waServer();

var QR;
client.on("qr", qr => QR = qr)
app.use("/users", user_router);
app.use("/packing", packing_router);
app.use("/dbstock", dbstock_router);
app.get("/qrcode", (req, res) => {
  res.status(200).send(QR);
});
app.get("/", (req, res) => {
  res.status(200).send("etera-trade api");
});
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
