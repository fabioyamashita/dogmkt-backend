const mongoose = require('mongoose');

const mockDog = {
  idSeller: new mongoose.Types.ObjectId("5f8d0b2b4f4d4b1b3c6f1b1a"),
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

module.exports = {
  mockDog,
};