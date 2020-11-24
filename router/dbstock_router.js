const express = require("express")
const router = express.Router()
const { dbstock_controller } = require("../controller")
const { userAuthentication } = require("../support/jwt");

router.post("/order-note/add", userAuthentication, dbstock_controller.add)
router.get("/database_stock/all", userAuthentication, dbstock_controller.getAll)
router.get("/database_stock/get/:IDMARKING", userAuthentication, dbstock_controller.getByIdMarking)

module.exports = router