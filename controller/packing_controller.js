const db = require("../database");
const util = require("util");
const dbquery = util.promisify(db.query).bind(db);
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { uploader } = require("../support/uploader");
const { createToken } = require("../support/jwt");
const currentTime = () => moment().utc().format("YYYY-MM-DD hh:mm:ss");
const client = require("../client");

module.exports = {
  updateStatusPacking: async (req, res) => {
    try {
      if (req.user.role === "admin") {
        let query = `UPDATE packing SET status = "${req.body.status}" WHERE idpacking = ${req.params.IDPACKING}`;
        await dbquery(query)
        res.status(200).send({message: "Success"});
      } else {
        res.status(400).send({ message: "Bukan Admin Kau!" });
      }
    } catch (err) {
      res.status(500).send({message: "Error Update Status", error: err});
    }
  },
  getAll: async (req, res) => {
    try {
      let packing = await dbquery("SELECT * FROM packing");
      let packing_image = await dbquery("SELECT * FROM packing_image");
      let results = packing.map((e) => {
        return {
          ...e,
          packing_image: packing_image.filter(
            (x) => e.idpacking === x.idpacking
          ),
        };
      });
      res.status(200).send(results);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getByIdMarking: async (req, res) => {
    try {
      let packing = await dbquery(
        `SELECT * FROM packing WHERE idmarking = "${req.params.IDMARKING}"`
      );
      let packing_image = await dbquery(`SELECT * FROM packing_image`);
      let results = packing.map((e) => {
        return {
          ...e,
          packing_image: packing_image.filter(
            (x) => e.idpacking === x.idpacking
          ),
        };
      });
      res.status(200).send(results);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  addPackingList: async (req, res) => {
    db.beginTransaction(async () => {
      let uploadFile = util.promisify(
        uploader("/pl_image", "IMG").fields([
          { name: "pl_file" },
          { name: "pl_image" },
        ])
      );
      let files = [];
      let images = [];
      try {
        await uploadFile(req, res);
        if (req.files.pl_file) {
          files = req.files.pl_file.map((e) => `pl_file/${e.filename}`);
        }
        if (req.files.pl_image) {
          images = req.files.pl_image.map((e) => `pl_file/${e.filename}`);
        }
        let data = JSON.parse(req.body.data);
        let query = `INSERT INTO packing SET ?`;
        let results = await dbquery(query, {
          ...data,
          file: files.length > 0 ? files[0] : null,
        });
        let img = images.map((e) => [results.insertId, e]);
        console.log("img", img);
        query = `INSERT INTO packing_image (idpacking, image) VALUES ?`;
        results = await dbquery(query, [img]);
        await db.commit(
          res.status(200).send({
            message: "Success",
          })
        );
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
        return db.rollback(err);
      }
    });
  },
};
