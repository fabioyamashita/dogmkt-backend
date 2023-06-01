const request = require('supertest');
const userRepository = require('../../../src/repositories/userRepository');
const userService = require('../../../src/services/userService');
const app = require('../../../src/app');
const dotenv = require('dotenv');
dotenv.config();

const mockUser = { 
  name: 'John Albert',
  email: 'test@gmail.com',
  password: '1234',
  passwordConfirm: '1234',
  isSeller: false
};

const mockUserFound = { 
  id: '12315151560',
  name: 'John Albert',
  email: 'test@gmail.com',
  password: '1234',
  isSeller: false
};

userRepository.create = jest.fn();
userRepository.findByEmailWithPassword = jest.fn();
userService.findByEmailWithPassword = jest.fn();

describe('POST /login tests', () => {
  beforeEach(() => {
  });

  afterEach(() => { 
    jest.clearAllMocks();
    sinon.restore();
  });

  it('should return 400 if request body is not valid', async () => {
    // Arrange
    const invalidRequestBody = { 
      email: 'test@gmail.com'
    };
    
    // Act
    const response = await request(app)
      .post(`/api/v1/login`)
      .send(invalidRequestBody);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
    expect(userService.findByEmailWithPassword).not.toHaveBeenCalled();
  });

  it('should return 401 if password is not valid', async () => {
    // Arrange
    const validRequestBody = { 
      email: 'test@gmail.com',
      password: '1234'
    };

    userRepository.findByEmailWithPassword.mockResolvedValueOnce(mockUserFound);

    // Act
    const response = await request(app)
      .post(`/api/v1/login`)
      .send(validRequestBody);

    // Assert
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Incorrect email or password!");
    expect(userService.findByEmailWithPassword).toHaveBeenCalledWith(validRequestBody.email);
  });

  // TODO
  // it('should return 200 with a token and the user logged in', async () => {
  //   // Arrange
  //   const validRequestBody = { 
  //     email: 'test@gmail.com',
  //     password: '1234'
  //   };

  //   userRepository.findByEmailWithPassword.mockResolvedValueOnce(mockUserFound);

  //   // Act
  //   const response = await request(app)
  //     .post(`/api/v1/login`)
  //     .send(validRequestBody);

  //   // Assert
  //   expect(response.status).toBe(200);
  // });
});