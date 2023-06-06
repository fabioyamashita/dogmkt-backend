const userService = require('../../src/services/userService');
const userRepository = require("../../src/services/userService");

const mockUser = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com'
};

describe('userService.findById Tests', () => {
  afterEach(() => jest.clearAllMocks());
  
  userRepository.findById = jest.fn();

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

describe('userService.findByEmailWithPassword Tests', () => {
  afterEach(() => jest.clearAllMocks());
  
  userRepository.findByEmailWithPassword = jest.fn();

  describe('User email found in userRepository', () => {
    it('should return the User', async () => {
      // Arrange
      userRepository.findByEmailWithPassword.mockResolvedValueOnce(mockUser);
  
      // Act
      const user = await userService.findByEmailWithPassword(mockUser.email);
  
      // Assert
      expect(userRepository.findByEmailWithPassword).toHaveBeenCalledWith(mockUser.email);
      expect(user).toEqual(mockUser);
    });
  });

  describe('User email not found in userRepository', () => {
    it('should return null', async () => {
      // Arrange
      userRepository.findByEmailWithPassword.mockResolvedValueOnce(null);
  
      // Act
      const user = await userService.findByEmailWithPassword(mockUser.email);
  
      // Assert
      expect(userRepository.findByEmailWithPassword).toHaveBeenCalledWith(mockUser.email);
      expect(user).toBeNull();
    });
  });
});

describe('userService.create Tests', () => {
  afterEach(() => jest.clearAllMocks());
  
  userRepository.create = jest.fn();

  describe('User successfully created in userRepository', () => {
    it('should return the User', async () => {
      // Arrange
      userRepository.create.mockResolvedValueOnce(mockUser);
  
      // Act
      const user = await userService.create(mockUser);
  
      // Assert
      expect(userRepository.create).toHaveBeenCalledWith(mockUser);
      expect(user).toEqual(mockUser);
    });
  });

  describe('User not successfully created in userRepository', () => {
    it('should return null', async () => {
      // Arrange
      userRepository.create.mockResolvedValueOnce(null);
  
      // Act
      const user = await userService.create(mockUser);
  
      // Assert
      expect(userRepository.create).toHaveBeenCalledWith(mockUser);
      expect(user).toBeNull();
    });
  });
});

describe('userService.updateById Tests', () => {
  afterEach(() => jest.clearAllMocks());

  userRepository.updateById = jest.fn();

  describe('User successfully updated in userRepository', () => {
    it('should return the User', async () => {
      // Arrange
      const mockUpdatedUser = { 
        name: 'John Albert',
        isSeller: false
      };

      userRepository.updateById.mockResolvedValueOnce(mockUpdatedUser);
  
      // Act
      const user = await userService.updateById("647bee3078f3a53a0362df4f", mockUpdatedUser);
  
      // Assert
      expect(userRepository.updateById).toHaveBeenCalledWith("647bee3078f3a53a0362df4f", mockUpdatedUser);
      expect(user).toEqual(mockUpdatedUser);
    });
  });

  describe('User not successfully updated in userRepository', () => {
    it('should return null', async () => {
      // Arrange
      const mockUpdatedUser = { 
        name: 'John Albert',
        isSeller: false
      };

      userRepository.updateById.mockResolvedValueOnce(null);
  
      // Act
      const user = await userService.updateById("647bee3078f3a53a0362df4f", mockUpdatedUser);
  
      // Assert
      expect(userRepository.updateById).toHaveBeenCalledWith("647bee3078f3a53a0362df4f", mockUpdatedUser);
      expect(user).toBeNull();
    });
  });
});