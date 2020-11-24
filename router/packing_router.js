const express = require("express")
const router = express.Router()
const { packing_controller } = require("../controller")
const { userAuthentication } = require("../support/jwt");

router.get("/packing-list/all", packing_controller.getAll)
router.get("/packing-list/:IDMARKING", packing_controller.getByIdMarking)
router.patch("/packing-list/edit/:IDPACKING", userAuthentication, packing_controller.updateStatusPacking)
router.post("/packing-list/add", packing_controller.addPackingList)

module.exports = router