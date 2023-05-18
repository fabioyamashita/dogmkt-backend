const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/:id")
  .get(
    authController.protect, 
    userController.getUserById
    );

module.exports = router;
