const rewire = require("rewire");
const dotenv = require('dotenv');
let authController;

dotenv.config();

const mockUser = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com'
};

describe("createSendToken tests", () => {
  beforeEach(() => {
    authController = rewire('../../src/controllers/authController');
  });

  afterEach(() => {
    jest.clearAllMocks();
    authController = undefined;
  });

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  
  it("should create a token and send it along with the user data", () => {
    // Arrange
    const statusCode = 200;
    const token = "token123";
    const signTokenMock = jest.fn().mockReturnValue(token);
    const removePasswordFromOutputMock = jest.fn().mockReturnValue(mockUser);

    authController.__set__("signToken", signTokenMock);
    authController.__set__("removePasswordFromOutput", removePasswordFromOutputMock);
    const signToken = authController.__get__("signToken");
    const removePasswordFromOutput = authController.__get__("removePasswordFromOutput");
    const createSendToken = authController.__get__("createSendToken");

    // Act
    createSendToken(mockUser, statusCode, res);

    // Assert
    expect(signToken).toHaveBeenCalledWith(mockUser.id);
    expect(removePasswordFromOutput).toHaveBeenCalledWith(mockUser);
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        token,
        user: mockUser
      },
    });
  });
});

describe("removePasswordFromOutput tests", () => {
  beforeEach(() => {
    authController = rewire('../../src/controllers/authController');
  });

  afterEach(() => {
    jest.clearAllMocks();
    authController = undefined;
  });

  it("should remove the password property from the user object", () => {
    // Arrange
    const mockUserWithPassword = { 
      id: '64617c4eac31a04063dcffc2', 
      name: 'John Albert',
      isSeller: false,
      email: 'test@gmail.com',
      password: '1234'
    };

    const removePasswordFromOutput = authController.__get__("removePasswordFromOutput");

    // Act
    removePasswordFromOutput(mockUserWithPassword);

    // Assert
    expect(mockUserWithPassword).toEqual(mockUser);
    expect(mockUserWithPassword.password).toBeUndefined();
  });
});

describe('isValidLoginRequest tests', () => {
  let isValidLoginRequest;
  
  beforeEach(() => {
    authController = rewire('../../src/controllers/authController');
    isValidLoginRequest = authController.__get__("isValidLoginRequest");
  });

  afterEach(() => {
    jest.clearAllMocks();
    authController = undefined;
    isValidLoginRequest = undefined
  });

  test('should return true for a valid login request', () => {
    // Arrange
    const requestBody = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Act
    const result = isValidLoginRequest(requestBody);

    // Assert
    expect(result).toBe(true);
  });

  test('should return false if email is missing', () => {
    // Arrange
    const requestBody = {
      password: 'password123',
    };

    // Act
    const result = isValidLoginRequest(requestBody);

    // Assert
    expect(result).toBe(false);
  });

  test('should return false if password is missing', () => {
    // Arrange
    const requestBody = {
      email: 'test@example.com',
    };

    // Act
    const result = isValidLoginRequest(requestBody);

    // Assert
    expect(result).toBe(false);
  });

  test('should return false if both email and password are missing', () => {
    // Arrange
    const requestBody = {};

    // Act
    const result = isValidLoginRequest(requestBody);

    // Assert
    expect(result).toBe(false);
  });
});