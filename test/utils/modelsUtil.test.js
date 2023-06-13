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
});