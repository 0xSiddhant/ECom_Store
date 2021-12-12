const express = require("express");
const { from } = require("responselike");
const router = express.Router()

const { home, homeDummy } = require('../controllers/homeController')

router.route("/").get(home)
router.route("/homeDummy").get(homeDummy)

module.exports = router
