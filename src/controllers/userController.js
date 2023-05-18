const catchAsync = require("../utils/catchAsync");
const userService = require("../services/userService");

exports.getUserById = catchAsync(async (req, res, next) => {
  let user = await userService.findById(req.params.id);

  res.status(200).json({
    data: user
  });
})