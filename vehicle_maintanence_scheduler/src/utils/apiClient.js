const axios = require("axios");
const { getToken } = require("../../../logging_middleware/config");

const BASE_URL = "http://20.207.122.201/evaluation-service";

const apiClient = axios.create({
    baseURL: BASE_URL,
})

//token attachment
apiClient.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;

});

module.exports = apiClient;
