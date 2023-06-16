const dogRepository = require('../repositories/dogRepository');

exports.create = async (dogDTO) => {
  return await dogRepository.create(dogDTO);
};