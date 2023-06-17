const userController = require('../../src/controllers/userController');
const userService = require('../../src/services/userService');
const AppError = require('../../src/utils/appError');

const { mockUserDB: mockUser } = require("../mocks/user.mock");

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

userService.findById = jest.fn();
userService.updateById = jest.fn();

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

  describe('/PATCH /users/:idUser with a request body with a password property', () => {
    it('should call next() with an AppError with 400 code', async () => {
      // Arrange
      const mockUpdatedUser = { 
        name: 'John Albert',
        isSeller: false,
        password: 'test1234'
      };

      req.body = mockUpdatedUser;
  
      // Act
      await userController.updateUserById(req, res, next);
  
      // Assert
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        new AppError(400, "This endpoint is not for password changes.", "")
      );
    });
  });

  describe('/PATCH /users/:idUser with a request body with a email property', () => {
    it('should call next() with an AppError with 400 code', async () => {
      // Arrange
      const mockUpdatedUser = { 
        name: 'John Albert',
        isSeller: false,
        email: 'email@gmail.com',
      };

      req.body = mockUpdatedUser;

      // Act
      await userController.updateUserById(req, res, next);

      // Assert
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        new AppError(400, "The primary email cannot be modified. Please contact the support team for more information.", "")
      );
    }); 
  });

  describe('/PATCH /users/:idUser with a request body with a valid property', () => {
    it('should return 200 OK and send User in response body', async () => {
      // Arrange
      const mockUpdatedUser = { 
        name: 'John Albert 2',
        isSeller: true
      };

      const mockReturnUpdatedUser = { 
        id: '64617c4eac31a04063dcffc2', 
        name: mockUpdatedUser.name,
        isSeller: mockUpdatedUser.isSeller,
        email: 'test@gmail.com'
      };
      
      req.body = mockUpdatedUser;

      userService.updateById.mockResolvedValueOnce(mockReturnUpdatedUser);

      // Act
      await userController.updateUserById(req, res, next);

      // Assert
      expect(userService.updateById).toHaveBeenCalledWith(mockUser.id, mockUpdatedUser);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockReturnUpdatedUser });
    });
  });

  describe('/PATCH /users/:idUser with a request body with a valid property and an ID that does not exist', () => {
    it('should call next() with an AppError with 404 code', async () => {
      // Arrange
      const mockUpdatedUser = { 
        name: 'John Albert 2',
        isSeller: true
      };

      req.body = mockUpdatedUser;

      userService.updateById.mockResolvedValueOnce(null);

      // Act
      await userController.updateUserById(req, res, next);

      // Assert
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        new AppError(404, "No user found with that ID.", "")
      );
    });
  });
});
