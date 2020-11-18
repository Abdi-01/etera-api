const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

module.exports = {
  createToken: (data, option) => jwt.sign(data, secret, option),
  userAuthentication: (req, res, next) => {
    console.log(req.token)
    if (req.method !== "OPTIONS") {
      jwt.verify(req.token, secret, (error, decoded) => {
        if (error) {
          return res.status(401).send({
            message: "You are not authorized",
          });
        }
        console.log(decoded);
        req.user = decoded;
        next();
      });
    } else {
      next();
      res.status(400).send({ message: "Expired or Invalid Token" });
    }
  },
};
