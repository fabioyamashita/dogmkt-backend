const mongoose = require('mongoose');
const Dog = require('../../src/models/dogModel');

const validDogData = {
  idSeller: "5f8d0b2b4f4d4b1b3c6f1b1a",
  availableQuantity: 5,
  name: "Cute Dog",
  breed: "Samoyed",
  genre: 'male',
  price: 1000,
  description: "A cute dog.",
  dateOfBirth: new Date("2020-10-18"),
  weight: 10,
  height: 50,
  width: 40,
  pictureUrl: "https://plus.unsplash.com/premium_photo-1674236550435-cffd5dddf90a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
};

describe('dogModel tests', () => {
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
    await Dog.deleteMany({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save a new dog to the database', async () => {
    // Arrange
    const dog = new Dog(validDogData);

    // Act
    await dog.save();

    // Assert
    expect(dog._id).toBeDefined();
    expect(dog.isNew).toBe(false);
    expect(dog.name).toBe(validDogData.name);
  });

  it('should transform the dog model output correctly', () => {
    // Arrange
    const dog = new Dog(validDogData);

    // Act
    const transformedDog = dog.toObject();

    // Assert
    expect(transformedDog).toHaveProperty('id');
    expect(transformedDog).not.toHaveProperty('_id');
    expect(transformedDog).not.toHaveProperty('__v');
  });

  it('should fail to save a dog with missing required fields', async () => {
    // Arrange
    const invalidDogData = {
      idSeller: "5f8d0b2b4f4d4b1b3c6f1b1a",
      availableQuantity: 5,
      breed: "Samoyed",
      genre: 'male',
      price: 1000,
      description: "A cute dog.",
      dateOfBirth: new Date("2020-10-18"),
      weight: 10,
      height: 50,
      width: 40,
      pictureUrl: "https://plus.unsplash.com/premium_photo-1674236550435-cffd5dddf90a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    };

    const dog = new Dog(invalidDogData);

    // Act
    let error = null;
    try {
      await dog.save();
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.name).toBeInstanceOf(mongoose.Error.ValidatorError);
    expect(error.errors.name).toHaveProperty("message", "Please, tell us the name of the dog.");
  });

  it('should fail to save a dog with availableQuantity less than 0', async () => {
    // Arrange
    const invalidDogData = {
      availableQuantity: -1,
    };

    const dog = new Dog(invalidDogData);

    // Act
    let error = null;
    try {
      await dog.save();
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeDefined();
    expect(error.errors.availableQuantity).toBeDefined();
    expect(error.errors.availableQuantity).toBeInstanceOf(mongoose.Error.ValidatorError);
    expect(error.errors.availableQuantity).toHaveProperty("message", "Quantity must be greater than or equal to 0.");
  });

  it('should fail to save a dog with availableQuantity that is not an integer', async () => {
    // Arrange
    const invalidDogData = {
      availableQuantity: 2.5,
    };

    const dog = new Dog(invalidDogData);

    // Act
    let error = null;
    try {
      await dog.save();
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeDefined();
    expect(error.errors.availableQuantity).toBeDefined();
    expect(error.errors.availableQuantity).toBeInstanceOf(mongoose.Error.ValidatorError);
    expect(error.errors.availableQuantity).toHaveProperty("message", `'${invalidDogData.availableQuantity}' must be an integer value.`);
  });

  it('should fail to save a dog with a genre that is not male or female', async () => {
    // Arrange
    const invalidDogData = {
      genre: 'wrongGenre',
    };

    const dog = new Dog(invalidDogData);

    // Act
    let error = null;
    try {
      await dog.save();
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeDefined();
    expect(error.errors.genre).toBeDefined();
    expect(error.errors.genre).toBeInstanceOf(mongoose.Error.ValidatorError);
    expect(error.errors.genre).toHaveProperty("message", `Invalid gender. Must be either "male" or "female".`);
  });

  it('should fail to save a dog with a price less than 0', async () => {
    // Arrange
    const invalidDogData = {
      price: -1,
    };

    const dog = new Dog(invalidDogData);

    // Act
    let error = null;
    try {
      await dog.save();
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeDefined();
    expect(error.errors.price).toBeDefined();
    expect(error.errors.price).toBeInstanceOf(mongoose.Error.ValidatorError);
    expect(error.errors.price).toHaveProperty("message", "Price must be greater than or equal to 0.");   
  });

  it('should fail to save a dog with a weight less than 0.01 kg', async () => {
    // Arrange
    const invalidDogData = {
      weight: -1,
    };

    const dog = new Dog(invalidDogData);

    // Act
    let error = null;
    try {
      await dog.save();
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeDefined();
    expect(error.errors.weight).toBeDefined();
    expect(error.errors.weight).toBeInstanceOf(mongoose.Error.ValidatorError);
    expect(error.errors.weight).toHaveProperty("message", "Weight must be greater than or equal to 0.01 kg.");      
  });

  it('should fail to save a dog with a height than 1 cm', async () => {
    // Arrange
    const invalidDogData = {
      height: -1,
    };

    const dog = new Dog(invalidDogData);

    // Act
    let error = null;
    try {
      await dog.save();
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeDefined();
    expect(error.errors.height).toBeDefined();
    expect(error.errors.height).toBeInstanceOf(mongoose.Error.ValidatorError);
    expect(error.errors.height).toHaveProperty("message", "Height must be greater than or equal to 1 cm.");      
  });

  it('should fail to save a dog with a width than 1 cm', async () => {
    // Arrange
    const invalidDogData = {
      width: -1,
    };

    const dog = new Dog(invalidDogData);

    // Act
    let error = null;
    try {
      await dog.save();
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeDefined();
    expect(error.errors.width).toBeDefined();
    expect(error.errors.width).toBeInstanceOf(mongoose.Error.ValidatorError);
    expect(error.errors.width).toHaveProperty("message", "Width must be greater than or equal to 1 cm.");      
  });

  it('should fail to save a dog with a invalid pictureUrl', async () => {
    // Arrange
    const invalidDogData = {
      pictureUrl: "invalidUrl",
    };

    const dog = new Dog(invalidDogData);

    // Act
    let error = null;
    try {
      await dog.save();
    } catch (err) {
      error = err;
    }
    
    // Assert
    expect(error).toBeDefined();
    expect(error.errors.pictureUrl).toBeDefined();
    expect(error.errors.pictureUrl).toBeInstanceOf(mongoose.Error.ValidatorError);
    expect(error.errors.pictureUrl).toHaveProperty("message", "Invalid URL.");
  });
});