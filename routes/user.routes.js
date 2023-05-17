const express = require("express");
const authController = require("../controllers/auth.controller");
const userController = require("./../controllers/user.controller");

const router = express.Router();

router
  .route("/:id")
  .get(
    authController.protect, 
    userController.getUser
    );

module.exports = router;
