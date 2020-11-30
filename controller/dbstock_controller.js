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
  sendBroadcastArrived: async (req, res) => {
    try{
      req.body.map(e => {
        client.sendMessage(`${e.noWhatsapp}@c.us`,`${e.resi_china}`)
      })
      res.status(200).send({message: "success"})
    }catch(err){
      res.status(200).send({message: "Error send broadcast", error: err})
    }
  },
  getAll: async (req, res) => {
    try {
      if(req.user.role === "admin"){
        let results = await dbquery("SELECT * FROM database_stock");
        res.status(200).send(results);
      }else {
        res.status(400).send({ message: "Bukan Admin Kau!" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getByIdMarking: async (req, res) => {
    try {
      if(req.user.role === "admin"){
        let results = await dbquery(`SELECT * FROM database_stock WHERE idmarking = "${req.params.IDMARKING}"`);
        res.status(200).send(results);
      }else {
        res.status(400).send({ message: "Bukan Admin Kau!" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  add: async (req, res) => {
    console.log(req.body);
    try {
      if (req.user.role === "admin") {
        let query = `INSERT INTO database_stock SET ?`;
        let results = await dbquery(query, {
          ...req.body,
          date: currentTime(),
        });
        results = await dbquery(
          `SELECT * FROM users WHERE idmarking = "${req.body.idmarking}"`
        );
        console.log(results)
        client.sendMessage(`${results[0].noWhatsapp}@c.us`,
        `Hallo ${results[0].fullname}, barang kamu telah berada digudang China.
        \nDan berikut no resi kamu : ${req.body.nomor_resi}.
        \nSelanjutnya silahkan pilih jalur untuk pengiriman dari China :
        \n1. Jalur Resmi
        \n2. Jalur Alternatif
        \nContoh Format Balasan :
        \nETERATRADE#JALUR#1#CODE1`
        );
        client.sendMessage(`${results[0].noWhatsapp}@c.us`, `ETERATRADE#JALUR#{PILIHANJALUR}#{ORDERCODE}`)
        res.status(200).send({ message: "Success" });
      } else {
        res.status(400).send({ message: "Bukan Admin Kau!" });
      }
    } catch (err) {
      res.status(500).send({ message: "Error Add", error: err });
    }
  },
};
