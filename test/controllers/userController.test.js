const userController = require('../../src/controllers/userController');
const userService = require('../../src/services/userService');

userService.findById = jest.fn();

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

describe('userController Tests', () => {
  describe('/GET /users/:idUser', () => {
    beforeEach(() => setInitialMockValues());
    afterEach(() => jest.clearAllMocks());
  
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
});
