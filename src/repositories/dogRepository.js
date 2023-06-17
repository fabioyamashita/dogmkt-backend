const Dog = require('../models/dogModel');

exports.create = async (dogDTO) => {
  return await Dog.create(dogDTO);
};