const Dog = require("../../src/models/dogModel");
const mongoose = require('mongoose');
const dogRepository = require("../../src/repositories/dogRepository");
const sinon = require("sinon");

const { mockDog } = require('../mocks/dog.mock');

describe("dogRepository.create Tests", () => {
  afterEach(() => jest.clearAllMocks());

  Dog.create = jest.fn();

  it('should successfully create in DB with a valid Dog and return the created Dog', async () => {
    // Arrange
    Dog.create.mockResolvedValueOnce(mockDog);

    // Act
    const dog = await dogRepository.create(mockDog);

    // Assert
    expect(Dog.create).toHaveBeenCalledWith(mockDog);
    expect(dog).toEqual(mockDog);
  });

  it('should return null when trying to create a Dog with an invalid Dog', async () => {
    // Arrange
    Dog.create.mockResolvedValueOnce(null);

    // Act
    const dog = await dogRepository.create(mockDog);

    // Assert
    expect(Dog.create).toHaveBeenCalledWith(mockDog);
    expect(dog).toEqual(null);
  });
});