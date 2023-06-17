const mongoose = require('mongoose');
const dogController = require('../../src/controllers/dogController');
const dogService = require('../../src/services/dogService');
const AppError = require('../../src/utils/appError');

let req, res, next;

const setInitialMockValues = () => {
  req = {
    params: {
      id: '5f8d0b2b4f4d4b1b3c6f1b1a'
    }
  };
  
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  
  next = jest.fn(); 
};

const mockDog = {
  idSeller: new mongoose.Types.ObjectId("5f8d0b2b4f4d4b1b3c6f1b1a"),
  availableQuantity: 5,
  name: "Cute Dog",
  breed: "Samoyed",
  genre: 'male',
  price: 1000,
  description: "A cute dog.",
  dateOfBirth: new Date("2020-10-18"),
  weight: 10,
  height: 50,
  width: 40,
  pictureUrl: "https://plus.unsplash.com/premium_photo-1674236550435-cffd5dddf90a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
};

dogService.create = jest.fn();

describe('dogController.createDog Tests', () => {
  beforeEach(() => setInitialMockValues());
  afterEach(() => jest.clearAllMocks());

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