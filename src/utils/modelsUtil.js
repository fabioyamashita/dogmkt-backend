class ModelUtils {
  static validateUrlFormat(url) {
    const urlFormat = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return urlFormat.test(url);
  }
}

module.exports = ModelUtils;
