const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../src/app');
const User = require('../../../src/models/userModel');
const userService = require('../../../src/services/userService');

const { mockUserRequestBody: mockUser } = require('../../../test/mocks/user.mock');

describe('POST /signup tests', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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

  it('should return 204 No Content if request body is a valid User', async () => {
    // Act
    const response = await request(app)
      .post(`/api/v1/signup`)
      .send(mockUser);

    // Assert
    expect(response.status).toBe(204);
  });

  it('should return 400 if request body is missing a field', async () => {
    // Arrange
    const invalidMockUser = { 
      name: 'John Albert',
      password: 'test1234',
      isSeller: false
    };

    // Act
    const response = await request(app)
      .post(`/api/v1/signup`)
      .send(invalidMockUser);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
  });

  it('should return 400 if there is no request body', async () => {
    // Act
    const response = await request(app)
      .post(`/api/v1/signup`)

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
  });

  // TODO FIX THIS TEST
  // not working as expected
  // it('should return 400 if the user already exists', async () => {
  //   // Arrange
  //   const existingUser = new User(mockUser);
  //   await existingUser.save();

  //   // Act
  //   const response = await request(app)
  //     .post(`/api/v1/signup`)
  //     .send(mockUser);

  //   // Assert
  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toBe("The request contains malformed data in parameters.");
  // });

  it('should return 422 if the user is null', async () => {
    // Arrange
    userService.create = jest.fn().mockResolvedValue(null);

    // Act
    const response = await request(app)
      .post(`/api/v1/signup`)
      .send(mockUser);

    // Assert
    expect(response.status).toBe(422);
    expect(response.body.message).toBe("The request was well-formed but unable to be followed due to semantic errors.");
  });
});