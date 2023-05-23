const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const authController = require('../../src/controllers/authController');
const userService = require('../../src/services/userService');
const AppError = require('../../src/utils/appError');

const mockUser = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com'
};

const mockUserWithPassword = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com',
  password: '1234'
};

describe("createSendToken tests", () => {
  afterEach(() => jest.clearAllMocks());

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  authController.signToken = jest.fn();
  authController.removePasswordFromOutput = jest.fn();

  it("should create a token and send it along with the user data", () => {
    // Arrange
    const statusCode = 200;
    const token = "token123";
    authController.signToken.mockResolvedValueOnce("token123");

    // Act
    authController.createSendToken(mockUser, statusCode, res);

    // Assert
    expect(authController.signToken).toHaveBeenCalledWith(mockUser.id);
    expect(authController.removePasswordFromOutput).toHaveBeenCalledWith(user);
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        token,
        user: mockUser
      },
    });
  });
});
