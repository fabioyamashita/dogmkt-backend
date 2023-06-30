const Dog = require('../models/dogModel');

exports.create = async (dogDTO) => {
  return await Dog.create(dogDTO);
};

exports.getAll = async (query, page, limit) => {
    try {
      const result = await Dog.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

      return result || [];
    } catch (error) {
      return [];
    }
}

exports.countDocuments = async (query) => {
  try {
    const result = await Dog.countDocuments(query);
    return result || 0;
  } catch (error) {
    return 0;
  }
};