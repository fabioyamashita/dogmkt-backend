const userRepository = require("../repositories/userRepository")

exports.findById = async (id) => {
  let user = await userRepository.findById(id);
  return user;
};

exports.findByEmailWithPassword = async (email) => {
  let user = await userRepository.findByEmailWithPassword(email);
  return user;
};

exports.create = async (userDTO) => {
  let user = await userRepository.create(userDTO);
  return user;
};

exports.updateById = async (id, userDTO) => {
  let user = await userRepository.updateById(id, userDTO);
  return user;
};