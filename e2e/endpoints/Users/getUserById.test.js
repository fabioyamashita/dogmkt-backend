const request = require('supertest');
const sinon = require("sinon");
const userRepository = require('../../../src/repositories/userRepository');
const authController = require('../../../src/controllers/authController');

let app;
const authToken = "VALID-TOKEN";
const mockUser = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com'
};

userRepository.findById = jest.fn();

describe('GET /users/:idUser with a valid token', () => {

  beforeEach(() => {
    sinon.stub(authController, 'protect')
      .callsFake(function(req, res, next) {
          return next();
      });

    app = require('../../../src/app');
  });

  afterEach(() => { 
    jest.clearAllMocks();
    authController.protect.restore();
  });

  describe('request with an ID that exists', () => {
    test('should return 200 OK and send User in response body', async () => {
      // Arrange
      userRepository.findById.mockResolvedValueOnce(mockUser);
  
      // Act
      const response = await request(app)
        .get(`/api/v1/users/${mockUser.id}`)
        .set('Authorization', 'Bearer ' + authToken);
  
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id); 
    });
  });

  describe('request with an ID that does not exists', () => {
    test('it should return 404 Not Found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValueOnce(null);
      
      // Act
      const response = await request(app)
        .get(`/api/v1/users/${mockUser.id}`)
        .set('Authorization', 'Bearer ' + authToken);
  
      // Assert
      expect(response.status).toBe(404);
    });
  });
});