const Dog = require('../models/dogModel');

exports.create = async (dogDTO) => {
  return await Dog.create(dogDTO);
};

exports.getAll = async (query, page, limit) => {
  const result = await Dog.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  return result || [];
}

exports.countDocuments = async (query) => {
  const result = await Dog.countDocuments(query);
  return result || 0;
};