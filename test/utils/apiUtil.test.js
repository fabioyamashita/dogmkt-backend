const apiUtil = require("../../src/utils/apiUtil");

describe("apiUtil tests", () => {
  it('should remove "page" and "limit" fields from the query string', () => {
    // Arrange
    const queryString = { 
      name: "John", 
      age: 30, 
      page: 1, 
      limit: 10 
    };

    // Act
    const result = apiUtil.removeExcludedFields(queryString);

    // Assert
    expect(result).toEqual({ name: "John", age: 30 });
  });

  it('should not modify the query string if "page" and "limit" fields are not present', () => {
    // Arrange
    const queryString = { 
      name: "John", 
      age: 30 
    };

    // Act
    const result = apiUtil.removeExcludedFields(queryString);

    // Assert
    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should return an empty object if the query string is empty", () => {
    // Arrange
    const queryString = {};

    // Act
    const result = apiUtil.removeExcludedFields(queryString);

    // Assert
    expect(result).toEqual({});
  });
});
