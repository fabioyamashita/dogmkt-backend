const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../src/app');
const User = require('../../../src/models/userModel');

const mockUser = { 
  name: 'John Albert',
  email: 'johnalbertlogin@gmail.com',
  password: 'admin1234',
  passwordConfirm: 'admin1234',
  isSeller: false
};

describe('POST /login tests', () => {
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
    await User.deleteMany({}).exec();
  });

  afterEach(() => { 
    jest.clearAllMocks();
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
  });

  it('should return 401 if password is not valid', async () => {
    // Arrange
    const existingUser = new User(mockUser);
    await existingUser.save();

    const validRequestBody = { 
      email: 'johnalbertlogin@gmail.com',
      password: 'wrongPassword'
    };

    // Act
    const response = await request(app)
      .post(`/api/v1/login`)
      .send(validRequestBody);

    // Assert
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Incorrect email or password!");
  });

  it('should return 200 with a token and the user logged in', async () => {
    // Arrange
    const user = new User(mockUser);
    await user.save();

    process.env.JWT_SECRET = 'supersecret';
    process.env.JWT_EXPIRES_IN = '90d';

    const validRequestBody = { 
      email: 'johnalbertlogin@gmail.com',
      password: 'admin1234'
    };
  
    // Act
    const response = await request(app)
      .post(`/api/v1/login`)
      .send(validRequestBody);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.user).toBeDefined();
  });
});