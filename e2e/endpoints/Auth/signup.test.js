const request = require('supertest');
const userRepository = require('../../../src/repositories/userRepository');
const app = require('../../../src/app');

const mockUser = { 
  name: 'John Albert',
  email: 'test@gmail.com',
  password: '1234',
  passwordConfirm: '1234',
  isSeller: false
};

userRepository.create = jest.fn();

describe('POST /signup tests', () => {
  afterEach(() => { 
    jest.clearAllMocks();
  });

  it('should return 204 No Content if request body is a valid User', async () => {
    // Arrange
    userRepository.create.mockResolvedValueOnce(mockUser);

    // Act
    const response = await request(app)
      .post(`/api/v1/signup`)
      .send(mockUser);

    // Assert
    expect(response.status).toBe(204);
    expect(userRepository.create).toHaveBeenCalledWith(mockUser); 
  });

  it('should return 422 if request body is not a valid User', async () => {
    // Arrange
    userRepository.create.mockResolvedValueOnce(undefined);

    // Act
    const response = await request(app)
      .post(`/api/v1/signup`)
      .send(mockUser);

    // Assert
    expect(response.status).toBe(422);
    expect(userRepository.create).toHaveBeenCalledWith(mockUser);
  });
});