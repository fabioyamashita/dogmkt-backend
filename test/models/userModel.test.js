const mongoose = require('mongoose');
const User = require('../../src/models/userModel');

const validUserData = {
  name: "John Doe",
  email: "johndoeudermodel@example.com",
  password: "password123",
  passwordConfirm: "password123",
};

describe('userModel tests', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should save a new user to the database", async () => {
    // Arrange
    const user = new User(validUserData);

    // Act
    await user.save();

    // Assert
    expect(user._id).toBeDefined();
    expect(user.isNew).toBe(false);
    expect(user.password).not.toBe(validUserData.password);
    expect(user.passwordConfirm).toBeUndefined();
  });

  it("should fail to save a user with missing required fields", async () => {
    // Arrange
    const incompleteUserData = {
      email: "john@example.com",
      password: "password123",
      passwordConfirm: "password123"
    };

    const user = new User(incompleteUserData);

    // Act
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.name).toBeInstanceOf(mongoose.Error.ValidatorError);
    expect(error.errors.name).toHaveProperty("message", "Please, tell us your name");
  });

  it("should fail to save a user with an invalid email", async () => {
    // Arrange
    const invalidUserData = {
      name: "John Doe",
      email: "johnexample.com",
      password: "password123",
      passwordConfirm: "password123",
    };

    const user = new User(invalidUserData);

    // Act
    let error = null;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.email).toBeInstanceOf(mongoose.Error.ValidatorError);
    expect(error.errors.email).toHaveProperty("message", "Please provide a valid email");
  });

  it("should authenticate a user with the correct password", async () => {
    // Arrange
    const user = new User(validUserData);
    await user.save();

    // Act
    const authenticated = await user.correctPassword(
      "password123",
      user.password
    );

    // Assert
    expect(authenticated).toBe(true);
  });

  it("should not authenticate a user with the incorrect password", async () => {
    // Arrange
    const user = new User(validUserData);
    await user.save();

    // Act
    const authenticated = await user.correctPassword("wrongpassword", user.password);

    // Assert
    expect(authenticated).toBe(false);
  });

  it('should transform the user model output correctly', () => {
    // Arrange
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123'
    });

    // Act
    const transformedUser = user.toObject();

    // Assert
    expect(transformedUser).toHaveProperty('id');
    expect(transformedUser).not.toHaveProperty('_id');
    expect(transformedUser).not.toHaveProperty('__v');
  });
});