const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById);

module.exports = router;
