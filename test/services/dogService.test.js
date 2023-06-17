const mongoose = require('mongoose');
const dogService = require('../../src/services/dogService');
const dogRepository = require("../../src/repositories/dogRepository");

const { mockDog } = require('../mocks/dog.mock');

describe('dogService.create Tests', () => {
  afterEach(() => jest.clearAllMocks());
  
  dogRepository.create = jest.fn();

  it('should successfully create a Dog with a valid Dog and return the created Dog', async () => {
    // Arrange
    dogRepository.create.mockResolvedValueOnce(mockDog);

    // Act
    const dog = await dogService.create(mockDog);

    // Assert
    expect(dogRepository.create).toHaveBeenCalledWith(mockDog);
    expect(dog).toEqual(mockDog);
  });

  it('should return null when trying to create a Dog with an invalid Dog', async () => {
    // Arrange
    dogRepository.create.mockResolvedValueOnce(null);

    // Act
    const dog = await dogService.create(mockDog);

    // Assert
    expect(dogRepository.create).toHaveBeenCalledWith(mockDog);
    expect(dog).toBeNull();
  });
});