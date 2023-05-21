const userService = require('../../src/services/userService');
const userRepository = require("../../src/services/userService");

const mockUser = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com'
};

userRepository.findById = jest.fn();

describe('userService Tests', () => {
  afterEach(() => jest.clearAllMocks());

  describe('User ID found in userRepository', () => {
    it('should return the User', async () => {
      // Arrange
      userRepository.findById.mockResolvedValueOnce(mockUser);
  
      // Act
      const user = await userService.findById(mockUser.id);
  
      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(user).toEqual(mockUser);
    });
  });

  describe('User ID not found in userRepository', () => {
    it('should return null', async () => {
      // Arrange
      userRepository.findById.mockResolvedValueOnce(null);
  
      // Act
      const user = await userService.findById(mockUser.id);
  
      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(user).toBeNull();
    });
  });
});