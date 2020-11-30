const express = require("express")
const router = express.Router()
const { user_controller } = require("../controller")
const { userAuthentication } = require("../support/jwt");

router.get("/getall", user_controller.getAll)
router.post("/register", user_controller.register)
router.get("/check/:idmarking", user_controller.checkIdMarking)
router.patch("/verification", userAuthentication, user_controller.verifyAccount)
router.patch("/re-verification", user_controller.requestReverification)
router.post("/login", user_controller.login)
router.get("/keeplogin", userAuthentication, user_controller.keepLogin)
router.patch("/reset", user_controller.requestForgotPassword)
router.patch("/reset/password", userAuthentication, user_controller.resetPassword)
router.patch("/update-user", userAuthentication, user_controller.updateUser)
router.get("/track-resi/:RESI", user_controller.getResi)
module.exports = router