const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../../../src/models/userModel');
const sinon = require("sinon");
const authController = require('../../../src/controllers/authController');

let app;

const mockUser = { 
  name: 'John Albert',
  email: 'johnalbertuser@gmail.com',
  password: 'test1234',
  passwordConfirm: 'test1234',
  isSeller: false
};

describe('PATCH /users/{idUser} tests', () => {
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
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(() => { 
    jest.clearAllMocks();
  });

  it('should return 200 if the user is successfully updated', async () => {
    // Arrange
    const existingUser = new User(mockUser);
    await existingUser.save();

    const updatedUser = {
      name: 'John Albert 2',
      isSeller: true
    };

    // Act
    const response = await request(app)
      .patch(`/api/v1/users/${existingUser._id}`)
      .send(updatedUser);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(updatedUser.name);
    expect(response.body.data.isSeller).toBe(updatedUser.isSeller);
  });

  it('should return 400 if the request body contains a password property', async () => {
    // Arrange
    const existingUser = new User(mockUser);
    await existingUser.save();

    const updatedUser = {
      name: 'John Albert 2',
      isSeller: true,
      password: 'test1234'
    };

    // Act
    const response = await request(app)
      .patch(`/api/v1/users/${existingUser._id}`)
      .send(updatedUser);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("This endpoint is not for password changes.");
  });

  it('should return 400 if the request body contains an email property', async () => {
    // Arrange
    const existingUser = new User(mockUser);
    await existingUser.save();

    const updatedUser = {
      name: 'John Albert 2',
      isSeller: true,
      email: 'test@gmail.com'
    };

    // Act
    const response = await request(app)
    .patch(`/api/v1/users/${existingUser._id}`)
    .send(updatedUser);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The primary email cannot be modified. Please contact the support team for more information.");
  });

  it('should return 404 if the user is not found', async () => {
    // Arrange
    const updatedUser = {
      name: 'John Albert 2',
      isSeller: true
    };

    const nonExistingUserId = '5f9c2b8d2a8d0b1d1c9c9c9c';

    // Act
    const response = await request(app)
      .patch(`/api/v1/users/${nonExistingUserId}`)
      .send(updatedUser);

    // Assert
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No user found with that ID.");
  });
});