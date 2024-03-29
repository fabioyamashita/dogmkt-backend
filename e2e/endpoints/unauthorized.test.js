const request = require('supertest');
const app = require('../../src/app');
const userRepository = require('../../src/repositories/userRepository');
const userService = require('../../src/services/userService');
const dogRepository = require('../../src/repositories/dogRepository');
const dogService = require('../../src/services/dogService');

const { mockDog } = require('../../test/mocks/dog.mock');
const { mockUserDB: mockUser } = require('../../test/mocks/user.mock');

const authToken = "INVALIDTOKEN";

userRepository.findById = jest.fn();
userService.findById = jest.fn();
userRepository.updateById = jest.fn();
userService.updateById = jest.fn();
dogRepository.create = jest.fn();
dogRepository.getAll = jest.fn();
dogService.create = jest.fn();

describe('GET /users/:idUser tests', () => {
  afterEach(() => { jest.clearAllMocks(); });

  it('should return 401 Unauthorized with a request without a Bearer token in header', async () => {
    // Arrange
    userRepository.findById.mockResolvedValueOnce(mockUser);

    // Act
    const response = await request(app)
      .get(`/api/v1/users/${mockUser.id}`);
      
    // Assert
    expect(response.status).toBe(401);
  });

  it('should return 401 Unauthorized with a request with an invalid Bearer token in header', async () => {
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

describe('PATCH /users/:idUser tests', () => {
  afterEach(() => { jest.clearAllMocks(); });

  const updatedUser = {
    name: 'John Albert 2',
    isSeller: true
  };
  
  it('should return 401 Unauthorized with a request without a Bearer token in header', async () => {
    // Arrange
    userRepository.updateById.mockResolvedValueOnce(mockUser);

    // Act
    const response = await request(app)
      .patch(`/api/v1/users/${mockUser.id}`)
      .send(updatedUser);

    // Assert
    expect(response.status).toBe(401);
  });

  it('should return 401 Unauthorized with a request with an invalid Bearer token in header', async () => {
    // Arrange
    userRepository.updateById.mockResolvedValueOnce(null);

    // Act
    const response = await request(app)
      .patch(`/api/v1/users/${mockUser.id}`)
      .set('Authorization', 'Bearer ' + authToken)
      .send(updatedUser);

    // Assert
    expect(response.status).toBe(401);
  });
});

describe('POST /dogs tests', () => {
  afterEach(() => { jest.clearAllMocks(); });
  
  it('should return 401 Unauthorized with a request without a Bearer token in header', async () => {
    // Arrange
    dogRepository.create.mockResolvedValueOnce(mockDog);

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .send(mockDog);

    // Assert
    expect(response.status).toBe(401);
  });

  it('should return 401 Unauthorized with a request with an invalid Bearer token in header', async () => {
    // Arrange
    dogRepository.create.mockResolvedValueOnce(null);

    // Act
    const response = await request(app)
      .post('/api/v1/dogs')
      .set('Authorization', 'Bearer ' + authToken)
      .send(mockDog);

    // Assert
    expect(response.status).toBe(401);
  });
});

describe('GET /dogs tests', () => {
  afterEach(() => { jest.clearAllMocks(); });
  
  it('should return 401 Unauthorized with a request without a Bearer token in header', async () => {
    // Arrange
    dogRepository.getAll.mockResolvedValueOnce(null);

    // Act
    const response = await request(app)
      .get('/api/v1/dogs');

    // Assert
    expect(response.status).toBe(401);
  });

  it('should return 401 Unauthorized with a request with an invalid Bearer token in header', async () => {
    // Arrange
    dogRepository.getAll.mockResolvedValueOnce(null);

    // Act
    const response = await request(app)
      .get('/api/v1/dogs')
      .set('Authorization', 'Bearer ' + authToken);

    // Assert
    expect(response.status).toBe(401);
  });
});