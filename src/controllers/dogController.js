const dogService = require("../services/dogService");
const AppError = require("../utils/appError");

exports.createDog = async (req, res, next) => {
  const dog = await dogService.create({
    ...req.body,
  });

  if (!dog) {
    return next(new AppError(422, "The request was well-formed but unable to be followed due to semantic errors.", "Try again later!"));
  };

  res.location(`http://localhost:3000/api/v1/dogs/${dog.id}`);
  res.status(201).json({
    data: dog
  });
};

exports.getDogs = async (req, res, next) => {
  const dogsReturned = await dogService.getAll(req.query);

  res.status(200).json({
    data: dogsReturned.dogs,
    pagination: dogsReturned.pagination,
  });
};