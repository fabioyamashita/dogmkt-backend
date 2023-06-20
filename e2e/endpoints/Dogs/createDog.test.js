const request = require('supertest');
const mongoose = require('mongoose');
const sinon = require("sinon");
const Dog = require('../../../src/models/dogModel');
const dogService = require('../../../src/services/dogService');
const authController = require('../../../src/controllers/authController');

const { mockDog } = require('../../../test/mocks/dog.mock');

let app;

const authToken = "VALID-TOKEN";

describe('POST /dogs with a valid bearer token', () => {
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
    await Dog.deleteMany({});
  });

  afterEach(() => { 
    jest.clearAllMocks();
  });

  it('should successfully create a Dog with a valid Dog and return the created Dog with a 201 response', async () => {
    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(mockDog);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).not.toHaveProperty('_id');
    expect(response.body.data).not.toHaveProperty('__v');
    expect(response.body.data.name).toBe(mockDog.name);
    expect(response.body.data.dateOfBirth).toBe("2020-10-18");
  });

  it('should return the correct location header with a valid Dog', async () => {
    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(mockDog);

    // Assert
    expect(response.status).toBe(201);
    expect(response.header.location).toBe(`http://localhost:3000/api/v1/dogs/${response.body.data.id}`);
  });

  it('should return 400 if request body is missing a field', async () => {
    // Arrange
    let invalidDogMock = JSON.parse(JSON.stringify(mockDog));
    delete invalidDogMock.name;

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .send(invalidDogMock);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
  });

  it('should return 400 if availableQuantity is less than 0', async () => {
    // Arrange
    let invalidDogMock = JSON.parse(JSON.stringify(mockDog));
    invalidDogMock.availableQuantity = -1;

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .send(invalidDogMock);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
    expect(response.body.details).toContain("Quantity must be greater than or equal to 0.");
  });

  it('should return 400 if availableQuantity that is not an integer', async () => {
    // Arrange
    let invalidDogMock = JSON.parse(JSON.stringify(mockDog));
    invalidDogMock.availableQuantity = 1.5;

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .send(invalidDogMock);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
    expect(response.body.details).toContain(`'${invalidDogMock.availableQuantity}' must be an integer value.`);
  });

  it('should return 400 if the genre is neither male nor female', async () => {
    // Arrange
    let invalidDogMock = JSON.parse(JSON.stringify(mockDog));
    invalidDogMock.genre = "invalid";

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .send(invalidDogMock);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
    expect(response.body.details).toContain(`Invalid gender. Must be either "male" or "female".`);
  });

  it('should return 400 if the price is less than 0', async () => {
    // Arrange
    let invalidDogMock = JSON.parse(JSON.stringify(mockDog));
    invalidDogMock.price = -1;

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .send(invalidDogMock);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
    expect(response.body.details).toContain("Price must be greater than or equal to 0.");
  });

  it('should return 400 if the weight is lower than 0.01 kg', async () => {
    // Arrange
    let invalidDogMock = JSON.parse(JSON.stringify(mockDog));
    invalidDogMock.weight = 0;

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .send(invalidDogMock);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
    expect(response.body.details).toContain("Weight must be greater than or equal to 0.01 kg.");
  });

  it('should return 400 if the weight lower than 0.01 kg', async () => {
    // Arrange
    let invalidDogMock = JSON.parse(JSON.stringify(mockDog));
    invalidDogMock.weight = 0;

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .send(invalidDogMock);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
    expect(response.body.details).toContain("Weight must be greater than or equal to 0.01 kg.");
  });

  it('should return 400 if the height is lower than 1 cm', async () => {
    // Arrange
    let invalidDogMock = JSON.parse(JSON.stringify(mockDog));
    invalidDogMock.height = 0;

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .send(invalidDogMock);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
    expect(response.body.details).toContain("Height must be greater than or equal to 1 cm.");
  });

  it('should return 400 with an invalid pictureUrl', async () => {
    // Arrange
    let invalidDogMock = JSON.parse(JSON.stringify(mockDog));
    invalidDogMock.pictureUrl = "invalidURL";

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .send(invalidDogMock);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The request contains malformed data in parameters.");
    expect(response.body.details).toContain("Invalid URL.");
  });

  it('should return 422 if the dog is returned null from DB', async () => {
    // Arrange
    dogService.create = jest.fn().mockResolvedValue(null);

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .send(mockDog);

    // Assert
    expect(response.status).toBe(422);
    expect(response.body.message).toBe("The request was well-formed but unable to be followed due to semantic errors.");
  });
});