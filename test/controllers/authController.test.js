const rewire = require("rewire");

const { mockUserDB: mockUser, mockUserRequestBody } = require("../mocks/user.mock");

let authController;

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
    const mockUserWithPassword = mockUserRequestBody;
    const removePasswordFromOutput = authController.__get__("removePasswordFromOutput");

    // Act
    removePasswordFromOutput(mockUserWithPassword);

    // Assert
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
    isValidLoginRequest = undefined;
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

describe('isUserValidated tests', () => {
  let isUserValidated;
  
  beforeEach(() => {
    authController = rewire('../../src/controllers/authController');
    isUserValidated = authController.__get__("isUserValidated");
  });

  afterEach(() => {
    jest.clearAllMocks();
    authController = undefined;
    isUserValidated = undefined;
  });

  test('should return true if user exists and correctPassword resolves to true', async () => {
    // Arrange
    const user = {
      correctPassword: jest.fn().mockResolvedValueOnce(true),
      password: 'hashedPassword'
    };
    const password = 'password';

    // Act
    const result = await isUserValidated(user, password);

    // Assert
    expect(result).toBe(true);
    expect(user.correctPassword).toHaveBeenCalledWith(password, user.password);
  });

  test('should return false if user exists but correctPassword resolves to false', async () => {
    // Arrange
    const user = {
      correctPassword: jest.fn().mockResolvedValueOnce(false),
      password: 'hashedPassword'
    };
    const password = 'password';

    // Act
    const result = await isUserValidated(user, password);

    // Assert
    expect(result).toBe(false);
    expect(user.correctPassword).toHaveBeenCalledWith(password, user.password);
  });

  test('should return false if user is null or undefined', async () => {
    // Arrange
    const user = null;
    const password = 'password';

    // Act
    const result = await isUserValidated(user, password);

    // Assert
    expect(result).toBe(false);
  });
});

describe('getTokenFromHeaders tests', () => {
  let getTokenFromHeaders;
  
  beforeEach(() => {
    authController = rewire('../../src/controllers/authController');
    getTokenFromHeaders = authController.__get__("getTokenFromHeaders");
  });

  afterEach(() => {
    jest.clearAllMocks();
    authController = undefined;
    getTokenFromHeaders = undefined;
  });

  test('should return the token if it starts with "Bearer"', () => {
    // Arrange
    const headers = {
      authorization: 'Bearer myToken'
    };

    // Act
    const result = getTokenFromHeaders(headers);

    // Assert
    expect(result).toBe('myToken');
  });

  test('should return null if the authorization header is missing', () => {
    // Arrange
    const headers = {};

    // Act
    const result = getTokenFromHeaders(headers);

    // Assert
    expect(result).toBeNull();
  });

  test('should return null if the token does not start with "Bearer"', () => {
    // Arrange
    const headers = {
      authorization: 'Token myToken'
    };

    // Act
    const result = getTokenFromHeaders(headers);

    // Assert
    expect(result).toBeNull();
  });

  test('should return null if the token is missing', () => {
    // Arrange
    const headers = {
      authorization: 'Bearer'
    };

    // Act
    const result = getTokenFromHeaders(headers);

    // Assert
    expect(result).toBeNull();
  });
});