function generateRandomEmail() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let email = '';

  // Generate a random string for the email prefix
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    email += characters[randomIndex];
  }

  // Add the domain name
  email += '@gmail.com';

  return email;
}

const mockUserRequestBody = { 
  name: 'John Albert',
  email: generateRandomEmail(),
  password: 'admin1234',
  passwordConfirm: 'admin1234',
  isSeller: false
};

const mockUserDB = { 
  id: '64617c4eac31a04063dcffc2', 
  name: 'John Albert',
  isSeller: false,
  email: generateRandomEmail()
};

const authSignUpRequestBody = {
  name: "John Doe",
  email: generateRandomEmail(),
  password: "password123",
  passwordConfirm: "password123",
};

module.exports = {
  mockUserRequestBody,
  mockUserDB,
  authSignUpRequestBody
};