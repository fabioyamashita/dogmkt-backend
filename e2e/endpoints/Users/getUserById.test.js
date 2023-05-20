const request = require('supertest');
const userRepository = require('../../../src/repositories/userRepository');
const authController = require('../../../src/controllers/authController');
const sinon = require("sinon");

userRepository.findById = jest.fn();

let app;
const authToken = "VALID-TOKEN";

const mockUser = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com'
};


describe('GET /users/:idUser', () => {
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