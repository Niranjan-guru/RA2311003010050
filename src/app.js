// connection to express server and initialization of authentication
const express = require("express");
const { initAuth } = require("./initAuth");
const { Log } = require("../logging_middleware/logger");

// CREATE the express app
const app = express();
app.use(express.json());

// vehicle scheduler routes
const schedulerRoutes = require("../vehicle_maintanence_scheduler/src/routes/schedulerRoutes");
app.use("/api", schedulerRoutes);

// health check route
app.get("/", async (req, res) => {
  try {
    await Log("backend", "info", "route", "Health check endpoint hit");
    res.send("Server is running");
  } catch (err) {
    res.status(500).send("Error in health check");
  }
});

// authorization and server port setup
(async () => {
  await initAuth();

  await Log("backend", "info", "config", "Server initialized successfully");

  app.listen(3000, () => {
    console.log("----Server running on 3000!-----");
  });
})();
