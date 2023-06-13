const ModelUtils = require('../../src/utils/modelsUtil');

describe('modelsUtil tests', () => {
  describe('validateUrlFormat tests', () => {
    it('should return true for a valid url format', () => {
      // Arrange
      const validUrl = 'https://www.google.com';

      // Act
      const isValidUrl = ModelUtils.validateUrlFormat(validUrl);

      // Assert
      expect(isValidUrl).toBe(true);
    });

    it('should return false for a invalid url format', () => {
      // Arrange
      const invalidUrl = 'www.google';

      // Act
      const isValidUrl = ModelUtils.validateUrlFormat(invalidUrl);

      // Assert
      expect(isValidUrl).toBe(false);
    });
  });

  describe('transformModelOutput tests', () => {
    it('should transform model output', () => {
      // Arrange
      const doc = {
        _id: '123',
        __v: 0,
        name: 'John Doe',
      };

      const ret = {};

      // Act
      ModelUtils.transformModelOutput(doc, ret);

      // Assert
      expect(ret).toHaveProperty('id');
      expect(ret).not.toHaveProperty('_id');
      expect(ret).not.toHaveProperty('__v');
    });
  });
});