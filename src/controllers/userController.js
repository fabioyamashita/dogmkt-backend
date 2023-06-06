const userService = require("../services/userService");
const AppError = require("../utils/appError");

exports.getUserById = async (req, res, next) => {
  let user = await userService.findById(req.params.id);

  if (!user) return next(new AppError(404, "No user found with that ID.", ""));

  res.status(200).json({
    data: user
  });
};

exports.updateUserById = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(400, "This endpoint is not for password changes.", ""));
  };

  if (req.body.email) {
    return next(new AppError(400, "The primary email cannot be modified. Please contact the support team for more information.", ""));
  };

  let user = await userService.updateById(req.params.id, req.body);

  if (!user) return next(new AppError(404, "No user found with that ID.", ""));

  res.status(200).json({
    data: user
  });
};