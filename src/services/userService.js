const AppError = require("../utils/appError");
const userRepository = require("../repositories/userRepository")

exports.findById = async (id) => {
    let user = await userRepository.findById(id);
    if (!user) throw new AppError(404, "No user found with that ID.", "");
    return user;
  };
