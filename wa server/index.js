const db = require("../database");
const util = require("util");
const dbquery = util.promisify(db.query).bind(db);
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { uploader } = require("../support/uploader");
const { createToken } = require("../support/jwt");
const currentTime = () => moment().utc().format("YYYY-MM-DD hh:mm:ss");
const client = require("../client");
const fs = require("fs");

module.exports = {
  waServer: () => {
    const SESSION_FILE_PATH = "./whatsapp-session.json";
    let Qr;
    client.initialize();

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
      switch (msg.body.toLowerCase()) {
        case "halo":
          msg.reply("Apasih ?");
      }
    });
  },
};
