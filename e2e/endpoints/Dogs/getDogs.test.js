const request = require('supertest');
const mongoose = require('mongoose');
const sinon = require("sinon");
const Dog = require('../../../src/models/dogModel');
const dogService = require('../../../src/services/dogService');
const authController = require('../../../src/controllers/authController');

const { mockDog, mockArrayDogs } = require('../../../test/mocks/dog.mock');

let app;

const authToken = "VALID-TOKEN";

describe('GET /dogs with a valid bearer token', () => {
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
    
    mockArrayDogs.forEach(async (dog) => {
      const existingDog = new Dog(dog);
      await existingDog.save();
    });
  });

  afterEach(() => { 
    jest.clearAllMocks();
  });

  const expectedPaginationNoDog = {
      first: null,
      last: null,
      previous: null,
      next: null,
      page: null,
      isFirst: null,
      isLast: null,
      totalElements: 0
  };

  it('should successfully get all Dogs with a 200 response', async () => {
    // Act
    const response = await request(app)
      .get('/api/v1/dogs')
      .set('Authorization', `Bearer ${authToken}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0].name).toBe(mockArrayDogs[0].name);
    expect(response.body.data[1].name).toBe(mockArrayDogs[1].name);
  });

  it('should successfully get a list of Dogs with a 200 response when filtering by idSeller', async () => {
    // Arrange
    const idSeller = mockArrayDogs[0].idSeller;

    // Act
    const response = await request(app)
      .get(`/api/v1/dogs?idSeller=${idSeller}`)
      .set('Authorization', `Bearer ${authToken}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0].name).toBe(mockArrayDogs[0].name);
  });

  it('should successfully get a list of Dogs with a 200 response when providing page = 1 and limit = 1', async () => {
    // Arrange
    const expectedPagination = {
      first: 1,
      last: 2,
      previous: null,
      next: 2,
      page: 1,
      isFirst: true,
      isLast: false,
      totalElements: 2,
    };
    
    // Act
    const response = await request(app)
      .get('/api/v1/dogs?page=1&limit=1')
      .set('Authorization', `Bearer ${authToken}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0].name).toBe(mockArrayDogs[0].name);
    expect(response.body.pagination).toEqual(expectedPagination);
  });

  it('should successfully get a empty list with a 200 response when providing page and limit above the maximum', async () => {
    // Arrange
    const currentPage = 1000;
    const expectedPagination = {
      first: 1,
      last: 1,
      previous: currentPage - 1,
      next: currentPage + 1,
      page: currentPage,
      isFirst: false,
      isLast: false,
      totalElements: 2,
    };

    // Act
    const response = await request(app)
      .get(`/api/v1/dogs?page=${currentPage}&limit=1000`)
      .set('Authorization', `Bearer ${authToken}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
    expect(response.body.pagination).toEqual(expectedPagination);
  });

  it('should successfully get a empty list with a 200 response when no Dog is found filtering by idSeller', async () => {
    // Act
    const response = await request(app)
      .get(`/api/v1/dogs?idSeller=5f8d0b2b4f4d4b1b3c6f1b49`)
      .set('Authorization', `Bearer ${authToken}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
    expect(response.body.pagination).toEqual(expectedPaginationNoDog);
  });

  it('should return a 400 response when providing an idSeller in a wrong format', async () => {
    // Act
    const response = await request(app)
      .get(`/api/v1/dogs?idSeller=INVALID-FORMAT-TOKEN`)
      .set('Authorization', `Bearer ${authToken}`);

    // Assert
    expect(response.status).toBe(400);
  });
});