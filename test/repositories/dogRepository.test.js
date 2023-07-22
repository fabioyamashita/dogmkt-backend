const Dog = require("../../src/models/dogModel");
const dogRepository = require("../../src/repositories/dogRepository");
const sinon = require("sinon");
const { mockDog, mockArrayDogs } = require('../mocks/dog.mock');

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

describe("dogRepository.countDocuments Tests", () => {
  afterEach(() => jest.clearAllMocks());
  Dog.countDocuments = jest.fn();

  it('should successfully count the number of documents in the DB', async () => {
    // Arrange
    Dog.countDocuments.mockResolvedValueOnce(10);

    // Act
    const result = await dogRepository.countDocuments({});

    // Assert
    expect(result).toEqual(10);
  });

  it('should return 0 when trying to count the number of documents in the DB and the result is null', async () => {
    // Arrange
    Dog.countDocuments.mockResolvedValueOnce(null);

    // Act
    const result = await dogRepository.countDocuments({});

    // Assert
    expect(result).toEqual(0);
  });
});

describe("dogRepository.getAll Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
    sinon.restore();
  });

  it('should successfully get all documents in the DB', async () => {
    // Arrange
    const query = {};
    const page = 1;
    const limit = 10;

    Dog.find = sinon.stub().callsFake(() => ({
      skip: sinon.stub().callsFake(() => ({
        limit: sinon.stub().resolves(mockArrayDogs)
      })),
    }));

    // Act
    const result = await dogRepository.getAll(query, page, limit);

    // Assert
    expect(result).toEqual(mockArrayDogs);
  });

  it('should return an empty array when trying to get all documents in the DB and the result is null', async () => {
    // Arrange
    const query = {};
    const page = 1;
    const limit = 10;

    Dog.find = sinon.stub().callsFake(() => ({
      skip: sinon.stub().callsFake(() => ({
        limit: sinon.stub().resolves(null)
      })),
    }));

    // Act
    const result = await dogRepository.getAll(query, page, limit);

    // Assert
    expect(result).toEqual([]);
  });
});