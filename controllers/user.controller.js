const User = require("./../models/user.model");
const AppError = require("../utils/appError.util");
const catchAsync = require("../utils/catchAsync.util");
const factory = require("./../factories/handler.factory");

exports.getUser = factory.getOne(User);