const AppError = require("../utils/appError");
const userRepository = require("../repositories/userRepository")

exports.findById = async (id) => {
    let user = await userRepository.findById(id);
    return user;
  };
