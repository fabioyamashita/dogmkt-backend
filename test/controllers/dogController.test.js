const dogController = require('../../src/controllers/dogController');
const dogService = require('../../src/services/dogService');
const AppError = require('../../src/utils/appError');

const { mockDog, mockArrayDogs } = require('../mocks/dog.mock');

let req, res, next;

const setInitialMockValues = () => {
  req = {
    params: {
      id: '5f8d0b2b4f4d4b1b3c6f1b1a'
    }
  };
  
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    location: jest.fn()
  };
  
  next = jest.fn(); 
};

describe('dogController.createDog Tests', () => {
  beforeEach(() => setInitialMockValues());
  afterEach(() => jest.clearAllMocks());

  dogService.create = jest.fn();

  it('should successfully create a Dog with a valid Dog and return the created Dog with a 201 response', async () => {
    // Arrange
    dogService.create.mockResolvedValueOnce(mockDog);

    // Act
    await dogController.createDog(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: mockDog
    });
  });

  it('should return the correct location header with a valid Dog', async () => {
    // Arrange
    dogService.create.mockResolvedValueOnce(mockDog);

    // Act
    await dogController.createDog(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.location).toHaveBeenCalledWith(`http://localhost:3000/api/v1/dogs/${mockDog.id}`);
  });

  it('should call next() with an AppError with 422 code', async () => {
    // Arrange
    dogService.create.mockResolvedValueOnce(null);

    // Act
    await dogController.createDog(req, res, next);

    // Assert
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new AppError(422, "The request was well-formed but unable to be followed due to semantic errors.", "Try again later!")
    );
  });
});

describe('dogController.getDogs Tests', () => {
  afterEach(() => jest.clearAllMocks());

  dogService.getAll = jest.fn()

  it('should successfully get all Dogs with with a 200 response', async () => {
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

    dogService.getAll.mockResolvedValueOnce({
      dogs: mockArrayDogs,
      pagination: pagination
    });

    // Act
    await dogController.getDogs(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: mockArrayDogs,
      pagination: pagination
    });
  });
});