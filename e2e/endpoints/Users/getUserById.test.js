const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../../../src/models/userModel');
const sinon = require("sinon");
const authController = require('../../../src/controllers/authController');

const { mockUserRequestBody: mockUser } = require('../../../test/mocks/user.mock');

let app;

const authToken = "VALID-TOKEN";

describe('GET /users/:idUser with a valid token', () => {
  let existingUser;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Bypass authController.protect middleware
    sinon.stub(authController, 'protect')
      .callsFake(function(req, res, next) {
          return next();
      });

    app = require('../../../src/app');
  });

  afterAll(async () => {
    await mongoose.connection.close();
    authController.protect.restore();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    existingUser = new User(mockUser);
    await existingUser.save();
  });

  afterEach(() => { 
    jest.clearAllMocks();
  });

  describe('request with an ID that exists', () => {
    test('should return 200 OK and send User in response body', async () => {
      // Arrange
      const userFound = { 
        id: existingUser._id.toString(),
        name: mockUser.name,
        email: mockUser.email,
        isSeller: mockUser.isSeller,
      };
  
      // Act
      const response = await request(app)
        .get(`/api/v1/users/${existingUser._id}`)
        .set('Authorization', 'Bearer ' + authToken);
  
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(userFound);
    });
  });

  describe('request with an ID that does not exists', () => {
    test('it should return 404 Not Found', async () => {
      // Arrange
      const nonExistingUserId = '5f9c2b8d2a8d0b1d1c9c9c9c';
      
      // Act
      const response = await request(app)
        .get(`/api/v1/users/${nonExistingUserId}`)
        .set('Authorization', 'Bearer ' + authToken);
  
      // Assert
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No user found with that ID.');
    });
  });
});