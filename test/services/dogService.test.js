const dogService = require('../../src/services/dogService');
const dogRepository = require("../../src/repositories/dogRepository");
const paginationUtil = require('../../src/utils/paginationUtil');
const apiUtil = require('../../src/utils/apiUtil');

const { mockDog, mockArrayDogs } = require('../mocks/dog.mock');

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

describe('dogService.getAll Tests', () => {
  afterEach(() => jest.clearAllMocks());

  paginationUtil.getPageLimit = jest.fn();
  apiUtil.removeExcludedFields = jest.fn();
  dogRepository.getAll = jest.fn();
  dogRepository.countDocuments = jest.fn();
  paginationUtil.getPaginationInfo = jest.fn();

  it('should successfully get all Dogs', async () => {
    // Arrange
    const pagination = {
      first: 1,
      last: 10,
      previous: null,
      next: 2,
      page: 1,
      isFirst: true,
      isLast: false,
      totalElements: 100,
    };

    const queryString = {};

    paginationUtil.getPageLimit.mockReturnValueOnce({ page: 1, limit: 10 });
    apiUtil.removeExcludedFields.mockReturnValueOnce(queryString);
    dogRepository.getAll.mockResolvedValueOnce(mockArrayDogs);
    dogRepository.countDocuments.mockResolvedValueOnce(1);
    paginationUtil.getPaginationInfo.mockReturnValueOnce(pagination);

    // Act
    const result = await dogService.getAll(queryString);

    // Assert
    expect(result).toEqual({ dogs: mockArrayDogs, pagination: pagination });
  });

  it('should return an empty array when trying to get all Dogs and no dog is found', async () => {
    // Arrange
    const pagination = {
      first: null,
      last: null,
      previous: null,
      next: null,
      page: null,
      isFirst: null,
      isLast: null,
      totalElements: 0,
    };

    const queryString = {};

    paginationUtil.getPageLimit.mockReturnValueOnce({ page: 1, limit: 10 });
    apiUtil.removeExcludedFields.mockReturnValueOnce(queryString);
    dogRepository.getAll.mockResolvedValueOnce([]);
    dogRepository.countDocuments.mockResolvedValueOnce(0);
    paginationUtil.getPaginationInfo.mockReturnValueOnce(pagination);

    // Act
    const result = await dogService.getAll(queryString);

    // Assert
    expect(result).toEqual({ dogs: [], pagination: pagination });
  });
});