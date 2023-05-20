const userService = require("../services/userService");
const AppError = require("../utils/appError");

exports.getUserById = async (req, res, next) => {
  let user = await userService.findById(req.params.id);

  if (!user) return next(new AppError(404, "No user found with that ID.", ""));

  res.status(200).json({
    data: user
  });
};