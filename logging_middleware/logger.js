const axios = require("axios");
const { getToken } = require("./config");

const VALID_STACK = ["backend", "frontend"];
const VALID_LEVEL = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGE = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
  "auth",
  "config",
  "middleware",
  "utils",
];

const Log = async (stack, level, pkg, message) => {
  try {
    // Validation
    if (!VALID_STACK.includes(stack)) throw new Error("Invalid stack");
    if (!VALID_LEVEL.includes(level)) throw new Error("Invalid level");
    if (!VALID_PACKAGE.includes(pkg)) throw new Error("Invalid package");

    const token = getToken();

    if (!token) {
      console.error("No token available");
      return;
    }

    await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
};

module.exports = { Log };
