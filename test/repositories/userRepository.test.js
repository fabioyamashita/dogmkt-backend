const User = require("../../src/models/userModel");
const userRepository = require("../../src/repositories/userRepository");
const sinon = require("sinon");

const mockUser = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com'
};

const mockUserWithPassword = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: 'test@gmail.com',
  password: '1234'
};

describe('userRepository.findById Tests', () => {
  afterEach(() => jest.clearAllMocks());

  User.findById = jest.fn();
  
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

describe('userRepository.findByEmailWithPassword Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    sinon.restore();
  });

  describe('User email found in DB', () => {
    it('should return the User', async () => {
      // Arrange
      const selectStub = sinon.stub().resolves(mockUserWithPassword);
      User.findOne = sinon.stub(User, "findOne").callsFake(() => ({
        select: selectStub,
      }));

      // Act
      const user = await userRepository.findByEmailWithPassword(mockUser.email);
  
      // Assert
      expect(user).toEqual(mockUserWithPassword);
    });
  });

  describe('User email not found in DB', () => {
    it('should return null', async () => {
      // Arrange
      const selectStub = sinon.stub().resolves(null);
      User.findOne = sinon.stub(User, "findOne").callsFake(() => ({
        select: selectStub,
      }));
  
      // Act
      const user = await userRepository.findByEmailWithPassword(mockUser.email);
  
      // Assert
      expect(user).toBeNull();
    });
  });
});

describe('userRepository.create Tests', () => {
  afterEach(() => jest.clearAllMocks());

  User.create = jest.fn();
  
  describe('User successfully created in DB', () => {
    it('should return the User', async () => {
      // Arrange
      User.create.mockResolvedValueOnce(mockUser);
  
      // Act
      const user = await userRepository.create(mockUser);
  
      // Assert
      expect(User.create).toHaveBeenCalledWith(mockUser);
      expect(user).toEqual(mockUser);
    });
  });

  describe('User not successfully created in DB', () => {
    it('should return null', async () => {
      // Arrange
      User.create.mockResolvedValueOnce(null);
  
      // Act
      const user = await userRepository.create(mockUser);
  
      // Assert
      expect(User.create).toHaveBeenCalledWith(mockUser);
      expect(user).toBeNull();
    });
  });
});

describe('userRepository.updateById Tests', () => {
  afterEach(() => jest.clearAllMocks());

  User.findByIdAndUpdate = jest.fn();

  describe('User successfully updated in DB', () => {
    it('should return the User', async () => {
      // Arrange
      const mockUpdatedUser = { 
        name: 'John Albert',
        isSeller: false
      };

      User.findByIdAndUpdate.mockResolvedValueOnce(mockUpdatedUser);
      
      // Act
      const user = await userRepository.updateById("647bee3078f3a53a0362df4f", mockUpdatedUser);
  
      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("647bee3078f3a53a0362df4f", mockUpdatedUser, { new: true });
      expect(user).toEqual(mockUpdatedUser);
    });
  });
});