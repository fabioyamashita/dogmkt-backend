const userController = require('../../src/controllers/userController');
const userService = require('../../src/services/userService');
const AppError = require('../../src/utils/appError');

let req, res, next;

const setInitialMockValues = () => {
  req = {
    params: {
      id: '64617c4eac31a04063dcffc2'
    }
  };
  
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  
  next = jest.fn(); 
};

const mockUser = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com'
};

userService.findById = jest.fn();

describe('userController Tests', () => {
  beforeEach(() => setInitialMockValues());
  afterEach(() => jest.clearAllMocks());

  describe('/GET /users/:idUser with an ID that exists', () => {
    it('should return 200 OK and send User in response body', async () => {
      // Arrange
      userService.findById.mockResolvedValueOnce(mockUser);
  
      // Act
      await userController.getUserById(req, res, next);
  
      // Assert
      expect(userService.findById).toHaveBeenCalledWith(mockUser.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockUser });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('/GET /users/:idUser with an ID that does not exists', () => {
    it('should call next() with an AppError with 404 code', async () => {
      // Arrange
      userService.findById.mockResolvedValueOnce(null);
  
      // Act
      await userController.getUserById(req, res, next);
  
      // Assert
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        new AppError(404, "No user found with that ID.", "")
      );
    });
  });
});
