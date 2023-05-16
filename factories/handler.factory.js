const AppError = require("../utils/appError.util");
const catchAsync = require("../utils/catchAsync.util");

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      data: doc
    });
  });
