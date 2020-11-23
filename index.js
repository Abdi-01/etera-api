const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const bearerToken = require("express-bearer-token");
const PORT = process.env.PORT;
const cors = require("cors");
const moment = require("moment");
const { user_router } = require("./router");

const fs = require("fs");
const client = require("./client");

var app = express();
app.use(bodyParser.json());
app.use(bearerToken());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const SESSION_FILE_PATH = "./whatsapp-session.json";

let Qr;
client.initialize();
client.on("qr", (qr) => {
  // get QR for login
  console.log("qr", qr);
  Qr = qr;
});

client.on("authenticated", (session) => {
  console.log("AUTHENTICATED", session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error("err");
    }
  });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  try {
    // get image from chat
    if (msg.hasMedia) {
      const attachment = await msg.downloadMedia();
      let date = Date.now();
      fs.writeFile(
        `image/etera-receipt-${moment().format("DD-MM-YYYY")}.png`,
        attachment.data,
        { encoding: "base64" },
        function (err) {
          if (err) {
            console.error(err);
          }
        }
      );
    } else if (msg.body.toLowerCase() == "barang sampai") {
      msg.reply(`Hello, Aldo!!\nTerima kasih telah melakukan pemesanan.
            `);
    } else if (msg.body.toLowerCase().includes("form alamat")) {
      console.log(msg.body);
      msg.reply(`Hello, Aldo !!\nKami akan segera mengirim barang pesanan anda.
            `);
    } else if (msg.body.toLowerCase().includes("pilihan jalur")) {
      if (msg.body.includes("1")) {
        msg.reply(`Hello, Aldo !!\nAnda telah memilih Jalur Resmi dengan Asuransi, tunggu info kami berikutnya.
                `);
      } else if (msg.body.includes("2")) {
        msg.reply(`Hello, Aldo !!\nAnda telah memilih Jalur Resmi tanpa Asuransi, tunggu info kami berikutnya.
                `);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

app.use("/users", user_router);
app.get("/", (req, res) => {
  res.status(200).send(Qr);
});
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
