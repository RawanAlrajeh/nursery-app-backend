const tokenBlacklist = [];

const addToBlacklist = (token) => {
  tokenBlacklist.push(token);
};

const isBlacklisted = (token) => {
  return tokenBlacklist.includes(token);
};

module.exports = { tokenBlacklist, addToBlacklist, isBlacklisted };
