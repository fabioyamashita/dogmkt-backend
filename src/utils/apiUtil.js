exports.removeExcludedFields = (queryString) => {
  const excludedFields = ["page", "limit"];
  excludedFields.forEach((el) => delete queryString[el]);
  
  return queryString;
}
