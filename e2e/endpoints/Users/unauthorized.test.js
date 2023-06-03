const request = require('supertest');
const app = require('../../../src/app');
const userRepository = require('../../../src/repositories/userRepository');
const userService = require('../../../src/services/userService');

const authToken = "INVALIDTOKEN";
const mockUser = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com'
};

userRepository.findById = jest.fn();
userService.findById = jest.fn();

describe('GET /users/:idUser with a invalid token', () => {
  afterEach(() => { jest.clearAllMocks(); });

  describe('request without a Bearer token in header', () => {
    test('should return 401 Unauthorized', async () => {
      // Arrange
      userRepository.findById.mockResolvedValueOnce(mockUser);
  
      // Act
      const response = await request(app)
        .get(`/api/v1/users/${mockUser.id}`);
        
      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('request with an ID that does exists', () => {
    test('should return 401 Unauthorized', async () => {
      // Arrange
      process.env.JWT_SECRET = 'secret';
      userService.findById.mockResolvedValueOnce(null);
  
      // Act
      const response = await request(app)
        .get(`/api/v1/users/${mockUser.id}`)
        .set('Authorization', 'Bearer ' + authToken);
        
      // Assert
      expect(response.status).toBe(401);
    });
  });
});

