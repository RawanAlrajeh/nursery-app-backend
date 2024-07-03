const generateRandomCode = (length) => {
  return Math.random().toString(36).substr(2, length).toUpperCase();
};

module.exports = { generateRandomCode };
