class ModelUtils {
  static validateUrlFormat(url) {
    const urlFormat = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return urlFormat.test(url);
  }

  static transformModelOutput(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
}

module.exports = ModelUtils;
