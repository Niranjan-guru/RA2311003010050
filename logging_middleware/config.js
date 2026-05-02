
// configuration of authorization token for logging middleware
let AUTH_TOKEN = null;

const setToken = (token) => {
  AUTH_TOKEN = token;
};

const getToken = () => AUTH_TOKEN;

module.exports = { setToken, getToken };