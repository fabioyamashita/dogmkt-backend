class ModelUtils {
  static validateDateFormat(date) {
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormat.test(date);
  }

  static validateUrlFormat(url) {
    const urlFormat = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    return urlFormat.test(url);
  }
}

module.exports = ModelUtils;
