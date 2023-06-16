const dogService = require("../services/dogService");
const AppError = require("../utils/appError");

exports.createDog = async (req, res, next) => {
  const dog = await dogService.create({
    ...req.body,
  });

  if (!dog) {
    throw new AppError(422, "The request was well-formed but unable to be followed due to semantic errors.", "Try again later!");
  };

  res.status(201).json({
    data: dog
  });
};