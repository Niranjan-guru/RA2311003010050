const axios = require("axios");
const { setToken } = require("../logging_middleware/config");

const initAuth = async () => {
  try {
    const res = await axios.post(
      "http://20.207.122.201/evaluation-service/auth",
      {
        email: "nb1999@srmist.edu.in",
        name: "Niranjan B",
        rollNo: "RA2311003010050",
        accessCode: "QkbpxH",
        clientID: "2d674b9d-958a-4863-bc95-0b6e28f59d15",
        clientSecret: "UvsnKZJkfJGwFMHE",
      },
    );

    setToken(res.data.access_token);

    console.log("Auth initialized");
  } catch (err) {
    console.error("Auth failed:", err.message);
  }
};

module.exports = { initAuth };