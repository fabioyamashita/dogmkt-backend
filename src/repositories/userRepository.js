const User = require("../models/userModel");

exports.findById = async (id) => {
  return await User.findById(id);
};