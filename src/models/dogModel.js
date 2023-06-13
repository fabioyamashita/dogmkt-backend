const mongoose = require("mongoose");
const ModelUtils = require("../utils/modelsUtil");

const transformUserModelOutput = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

const dogSchema = new mongoose.Schema(
  {
    idSeller: {
      type: String,
      required: [true, "Please, tell us the id of the seller."],
    },
    availableQuantity: {
      type: Number,
      required: [true, "Please, tell us the available quantity."],
      min: [0, "Quantity must be greater than or equal to 0."],
      validate: {
        validator: Number.isInteger,
        message: "'{VALUE}' must be an integer value.",
      },
    },
    name: {
      type: String,
      required: [true, "Please, tell us the name of the dog."],
    },
    breed: {
      type: String,
      required: [true, "Please, tell us the breed of the dog."],
    },
    genre: {
      type: String,
      required: [true, "Please, tell us the genre of the dog."],
      enum: {
        values: ['male', 'female'],
        message: 'Invalid gender. Must be either "male" or "female".'
      },
    },
    price: {
      type: Number,
      required: [true, "Please, tell us the price of the dog."],
      min: [0, "Price must be greater than or equal to 0."]
    },
    description : {
      type: String,
      required: [true, "Please, tell us the description of the dog."],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Please, tell us the date of birth of the dog."],
    },
    weight: {
      type: Number,
      required: [true, "Please, tell us the weight of the dog."],
      min: [0.01, "Weight must be greater than or equal to 0.01 kg."],
    },
    height: {
      type: Number,
      required: [true, "Please, tell us the height of the dog."],
      min: [1, "Height must be greater than or equal to 1 cm."],
    },
    width: {
      type: Number,
      required: [true, "Please, tell us the width of the dog."],
      min: [1, "Width must be greater than or equal to 1 cm."],
    },
    pictureUrl: {
      type: String,
      validate: {
        validator: ModelUtils.validateUrlFormat,
        message: "Invalid URL.",
      },
    }
  },
  {
    toJSON: {
      virtuals: true,
      transform: transformUserModelOutput,
    },
    toObject: { 
      virtuals: true, 
      transform: transformUserModelOutput 
    },
  }
);

const Dog = mongoose.model("Dog", dogSchema);

module.exports = Dog;
