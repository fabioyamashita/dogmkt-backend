const User = require("../../src/models/userModel");
const userRepository = require("../../src/services/userService");

const mockUser = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com'
};

User.findById = jest.fn();

describe('userRepository Tests', () => {
  afterEach(() => jest.clearAllMocks());

  describe('User ID found in DB', () => {
    it('should return the User', async () => {
      // Arrange
      User.findById.mockResolvedValueOnce(mockUser);
  
      // Act
      const user = await userRepository.findById(mockUser.id);
  
      // Assert
      expect(User.findById).toHaveBeenCalledWith(mockUser.id);
      expect(user).toEqual(mockUser);
    });
  });

  describe('User ID not found in DB', () => {
    it('should return null', async () => {
      // Arrange
      User.findById.mockResolvedValueOnce(null);
  
      // Act
      const user = await userRepository.findById(mockUser.id);
  
      // Assert
      expect(User.findById).toHaveBeenCalledWith(mockUser.id);
      expect(user).toBeNull();
    });
  });
});