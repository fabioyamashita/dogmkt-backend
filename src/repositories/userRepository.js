const User = require("../models/userModel");

exports.findById = async (id) => {
  return await User.findById(id);
};

exports.findByEmailWithPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

exports.create = async (userDTO) => {
  return await User.create(userDTO);
};

exports.updateById = async (id, userDTO) => {
  return await User.findByIdAndUpdate(id, userDTO, { new: true });
};