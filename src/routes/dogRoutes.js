const express = require("express");
const authController = require("../controllers/authController");
const dogController = require("../controllers/dogController");

const router = express.Router();

router.use(authController.protect);

router.post("/", dogController.createDog);

module.exports = router;
