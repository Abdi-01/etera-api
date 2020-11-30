const db = require("../database");
const util = require("util");
const dbquery = util.promisify(db.query).bind(db);
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { uploader } = require("../support/uploader");
const { createToken } = require("../support/jwt");
const currentTime = () => moment().format("YYYY-MM-DD hh:mm:ss");
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
      const MSG_FORMAT = msg.body.toLowerCase().split("#");
      console.log(MSG_FORMAT);
      if (MSG_FORMAT[0] === "eteratrade" && MSG_FORMAT.length === 4) {
        const MSG_FROM = msg.from.split("@")[0];
        const MSG_CODE = MSG_FORMAT[1];
        const MSG_OPTION = MSG_FORMAT[2];
        const MSG_ORDERCODE = MSG_FORMAT[3];
        let query = `SELECT * FROM users WHERE noWhatsapp = ?`;
        let user = await dbquery(query, MSG_FROM);
        if (user.length !== 0) {
          if (MSG_CODE === "jalur") {
            console.log(MSG_FROM);
            query = `SELECT * FROM users WHERE noWhatsapp = ?`;
            let results = await dbquery(query, MSG_FROM);
            console.log(results);
            if (MSG_OPTION === "1" || MSG_OPTION === "2") {
              query = `SELECT * FROM database_stock WHERE ordercode = ?`;
              results = await dbquery(query, MSG_ORDERCODE);
              if(results[0].jalur === null){
                query = `UPDATE database_stock SET jalur = "${
                  MSG_OPTION === "1" ? "Resmi" : "Alternatif"
                }" WHERE ordercode = ?`;
                results = await dbquery(query, MSG_ORDERCODE);
                msg.reply(`Hallo ${user[0].fullname}
                \nkamu telah memilih jalur ${
                  MSG_OPTION === "1" ? "Resmi" : "Alternatif"
                } untuk pesanan dengan kode ${MSG_ORDERCODE} tunggu kabar dari kami selanjutnya.`);
                console.log("berhasil");
              }else{
                return msg.reply(`Jalur dengan kode ${MSG_ORDERCODE} sudah terupdate sebelumnya`);
              }
            } else {
              return msg.reply("Format Balasan Salah");
            }
          } else {
            msg.reply("Format Balasan Salah!");
          }
        } else {
          msg.reply("Ga kenal! bukan member etera ya?");
        }
      }
    });
  },
};
