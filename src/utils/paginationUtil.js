const { paginationDefault } = require('../utils/constants');
const AppError = require('../utils/appError');

exports.getPaginationInfo = (page, limit, total) => {
  let paginationInfo = {
    first: null,
    last: null,
    previous: null,
    next: null,
    page: null,
    isFirst: null,
    isLast: null,
    totalElements: total,
  };

  if (total > 0) {
    const lastPage = Math.ceil(total / limit);

    paginationInfo.first = 1;
    paginationInfo.last = lastPage;
    paginationInfo.previous = page > 1 ? page - 1 : null;
    paginationInfo.next = page + 1;
    paginationInfo.page = page;
    paginationInfo.isFirst = page === 1;
    paginationInfo.isLast = page === lastPage;
  };

  return paginationInfo;
};

exports.validatePaginationParameters = (page, limit) => {
  if (page < 0 || limit < 0) {
    throw new AppError(400, "Invalid query parameters.", "'page' and 'limit' must be greater than 0.");
  }
}

exports.getPageLimit = (requestQuery) => {
  const page = requestQuery.page ? parseInt(requestQuery.page) : paginationDefault.FIRST_PAGE;
  const limit = requestQuery.limit ? parseInt(requestQuery.limit) : paginationDefault.LIMIT;

  this.validatePaginationParameters(page, limit);

  return { page, limit };
}
