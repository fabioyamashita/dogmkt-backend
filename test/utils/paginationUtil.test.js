const paginationUtil = require("../../src/utils/paginationUtil");
const AppError = require("../../src/utils/appError");
const { paginationDefault } = require("../../src/utils/constants");

describe("paginationUtil tests", () => {
  describe("getPaginationInfo tests", () => {
    it("should return paginationInfo object with correct values, when total is > 0", () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const total = 100;

      const expectedPaginationInfo = {
        first: 1,
        last: 10,
        previous: null,
        next: 2,
        page: 1,
        isFirst: true,
        isLast: false,
        totalElements: 100,
      };

      // Act
      const paginationInfo = paginationUtil.getPaginationInfo(
        page,
        limit,
        total
      );

      // Assert
      expect(paginationInfo).toEqual(expectedPaginationInfo);
    });

    it("should return paginationInfo object with correct values, when total is 0", () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const total = 0;

      const expectedPaginationInfo = {
        first: null,
        last: null,
        previous: null,
        next: null,
        page: null,
        isFirst: null,
        isLast: null,
        totalElements: total,
      };

      // Act
      const paginationInfo = paginationUtil.getPaginationInfo(
        page,
        limit,
        total
      );

      // Assert
      expect(paginationInfo).toEqual(expectedPaginationInfo);
    });
  });

  describe("validatePaginationParameters tests", () => {
    it('should not throw an error when page and limit are greater than 0', () => {
      // Arrange
      const page = 1;
      const limit = 10;

      // Act
      const validatePaginationParameters = () => {
        paginationUtil.validatePaginationParameters(page, limit);
      };

      // Assert
      expect(validatePaginationParameters).not.toThrow(AppError);
    });

    it("should throw an AppError, when page is < 0", () => {
      // Arrange
      const page = -1;
      const limit = 10;

      // Act
      const validatePaginationParameters = () => {
        paginationUtil.validatePaginationParameters(page, limit);
      };

      // Assert
      expect(validatePaginationParameters).toThrow(AppError);
    });

    it("should throw an AppError, when limit is < 0", () => {
      // Arrange
      const page = 1;
      const limit = -1;

      // Act
      const validatePaginationParameters = () => {
        paginationUtil.validatePaginationParameters(page, limit);
      };

      // Assert
      expect(validatePaginationParameters).toThrow(AppError);
    });
  });

  describe("getPageLimit tests", () => {
    it("should return page and limit, when they are present in request query", () => {
      // Arrange
      const requestQuery = {
        page: 1,
        limit: 10,
      };

      const expectedPageLimit = {
        page: 1,
        limit: 10,
      };

      // Act
      const pageLimit = paginationUtil.getPageLimit(requestQuery);

      // Assert
      expect(pageLimit).toEqual(expectedPageLimit);
    });

    it("should return page and limit, when they are not present in request query", () => {
      // Arrange
      const requestQuery = {};

      const expectedPageLimit = {
        page: paginationDefault.FIRST_PAGE,
        limit: paginationDefault.LIMIT,
      };

      // Act
      const pageLimit = paginationUtil.getPageLimit(requestQuery);

      // Assert
      expect(pageLimit).toEqual(expectedPageLimit);
    });
  });
});
