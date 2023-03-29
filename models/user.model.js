const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const transformUserModelOutput = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please, tell us your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only work on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
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

userSchema.pre("save", async function (next) {
  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field to no persist in DB
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;