const rewire = require("rewire");
let authController = rewire('../../src/controllers/authController');

const mockUser = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com'
};

describe("createSendToken tests", () => {
  beforeEach(() => {});
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    authController = rewire('../../src/controllers/authController');
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
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    authController = rewire('../../src/controllers/authController');
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

    const removePasswordFromOutput2 = authController.__get__("removePasswordFromOutput");

    // Act
    removePasswordFromOutput2(mockUserWithPassword);

    // Assert
    expect(mockUserWithPassword).toEqual(mockUser);
    expect(mockUserWithPassword.password).toBeUndefined();
  });
});
