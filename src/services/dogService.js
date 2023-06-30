const dogRepository = require('../repositories/dogRepository');
const paginationUtil = require('../utils/paginationUtil');
const apiUtil = require('../utils/apiUtil');

exports.create = async (dogDTO) => {
  return await dogRepository.create(dogDTO);
};

exports.getAll = async (requestQuery) => {
  let { page, limit } = paginationUtil.getPageLimit(requestQuery);

  let queryString = apiUtil.removeExcludedFields({ ...requestQuery });

  let dogsReturned = await dogRepository.getAll(queryString, page, limit);
  let countDogsReturned = await dogRepository.countDocuments(queryString);

  let paginationInfo = paginationUtil.getPaginationInfo(page, limit, countDogsReturned);

  return {
    dogs: dogsReturned,
    pagination: paginationInfo,
  };
};