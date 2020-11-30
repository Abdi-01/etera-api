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
  getAll: async (req, res) => {
    try {
      let results = await dbquery("SELECT * FROM users");
      res.status(200).send(results);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  register: (req, res) => {
    db.beginTransaction(async () => {
      let path = "/ktp";
      let upload = util.promisify(
        uploader(path, "IMG").fields([{ name: "image" }])
      );
      let newData
      try {
        await upload(req, res);
        let data = JSON.parse(req.body.data);
        let { image } = req.files;
        data.image_ktp = image ? path + "/" + image[0].filename : null;
        newData = data
        let query = `INSERT INTO users SET ?`;
        let results = await dbquery(query, {
          ...data,
          password: bcrypt.hashSync(data.password, 10),
        });
        let dataForToken = {
          iduser: results.insertId,
          idmarking: data.idmarking,
          role: "user",
          status: "unverified",
        };
        console.log("dataToken", dataForToken);
        let token = createToken(dataForToken);
        client.sendMessage(
          `${data.noWhatsapp}@c.us`,
          `Hai, ${data.fullname}
          \nThank you for your register at Etera Trade.
          \nClick this link below for verified your account :          
          \n${process.env.FRONTEND_URL}/verification/${token}`
        );
        await db.commit(
          res.status(200).send({
            messages: "Processing Registration",
            success: true,
            error: null,
          })
        );
      } catch (err) {
        console.log(err)
        console.log(newData)
        fs.unlinkSync("./public" + newData.image_ktp);
        res.status(500).send({ messages: "Error Register", error: err });
        return db.rollback(err);
      }
    });
  },
  checkIdMarking: async (req, res) => {
    try {
      let results = await dbquery(
        `SELECT * FROM users WHERE idmarking = "${req.params.idmarking}"`
      );
      if (results.length === 0) {
        res.status(200).send({ messages: "No-Exist", error: null });
      } else {
        res.status(200).send({ messages: "Exist", error: null });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ messages: "Error Check", error: err });
    }
  },
  verifyAccount: async (req, res) => {
    let query = `SELECT * FROM users WHERE iduser = ? AND idmarking = ?`;
    let results = await dbquery(query, [req.user.iduser, req.user.idmarking]);
    query = `UPDATE users SET ? WHERE iduser = ?`;
    await dbquery(query, [{ status: "verified" }, req.user.iduser]);
    let dataForToken = {
      iduser: results[0].iduser,
      idmarking: results[0].idmarking,
      role: results[0].role,
      status: "verified",
    };
    let token = createToken(dataForToken);
    res.status(200).send({ ...results[0], token });
  },
  login: async (req, res) => {
    try {
      let query = `SELECT * FROM users WHERE idmarking = ?`;
      let results = await dbquery(query, req.body.idmarking);
      console.log(results);
      if (
        results.length !== 0 &&
        bcrypt.compareSync(req.body.password, results[0].password)
      ) {
        let dataForToken = {
          iduser: results[0].iduser,
          idmarking: results[0].idmarking,
          role: results[0].role,
          status: results[0].status,
        };
        let token = req.body.keepLogin
          ? createToken(dataForToken)
          : createToken(dataForToken, { expiresIn: "12h" });
        delete results[0].password;
        res.status(200).send({
          messages: "Login Success",
          ...results[0],
          token,
        });
      } else {
        return res
          .status(200)
          .send({ messages: "Invalid username or password" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  keepLogin: async (req, res) => {
    try {
      let query = `SELECT * FROM users WHERE iduser = ? AND idmarking = ?`;
      let results = await dbquery(query, [req.user.iduser, req.user.idmarking]);
      res.status(200).send(results[0]);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  requestReverification: async (req, res) => {
    try {
      let query = `SELECT * FROM users WHERE idmarking = ? AND noWhatsapp = ?`;
      let results = await dbquery(query, [
        req.body.idmarking,
        req.body.noWhatsapp,
      ]);
      if (results.length !== 0) {
        //kirim link verification WA
        let dataForToken = {
          iduser: results[0].iduser,
          idmarking: results[0].idmarking,
          role: results[0].role,
          status: results[0].status,
        };
        console.log("dataToken", dataForToken);
        let token = createToken(dataForToken);
        client.sendMessage(
          `${req.body.noWhatsapp}@c.us`,
          `Your new verification account at Etera Trade.
          \nClick this link below for verified your account :
          \n${process.env.FRONTEND_URL}/verification/${token}`
        );
        res
          .status(200)
          .send({ messages: "Request Success", success: true, error: null });
      } else {
        res.status(200).send({ messages: "User Not Found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ messages: "Error Request", error: err });
    }
  },
  requestForgotPassword: async (req, res) => {
    try {
      let query = `SELECT * FROM users WHERE idmarking = ? AND noWhatsapp = ?`;
      let results = await dbquery(query, [
        req.body.idmarking,
        req.body.noWhatsapp,
      ]);
      if (results.length !== 0) {
        //kirim link verification WA
        let dataForToken = {
          iduser: results[0].iduser,
          idmarking: results[0].idmarking,
          role: results[0].role,
          status: results[0].status,
        };
        console.log("dataToken", dataForToken);
        let token = createToken(dataForToken);
        client.sendMessage(
          `${req.body.noWhatsapp}@c.us`,
          `Your new verification account at Etera Trade.
          \nClick this link below for verified your account :          
          \n${process.env.FRONTEND_URL}/verification/${token}`
        );
        res
          .status(200)
          .send({ messages: "Request Success", success: true, error: null });
      } else {
        res.status(200).send({ messages: "User Not Found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ messages: "Error Request", error: err });
    }
  },
  resetPassword: async (req, res) => {
    try {
      let query = `UPDATE users SET password = ? WHERE idmarking = "${req.user.idmarking}" AND iduser = ${req.user.iduser}`;
      await dbquery(query, bcrypt.hashSync(req.body.password, 10));
      res.status(200).send({ messages: "Update Password" });
    } catch (err) {
      console.log(err);
      res.status(200).send({ messages: "Error Update Password", error: err });
    }
  },
  updateUser: async (req, res) => {
    try {
      let query = `UPDATE users SET ? where idmarking = "${req.user.idmarking}" AND iduser = ${req.user.iduser}`;
      await dbquery(query, req.body);
      res.status(200).send({ messages: "User Updated" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ messages: "Error Update User", error: err });
    }
  },
};
