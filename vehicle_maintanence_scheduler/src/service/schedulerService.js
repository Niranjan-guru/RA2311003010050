// client connection and logging imports
const { Log } = require("../../../logging_middleware/logger");
const apiClient = require("../utils/apiClient");

// main optimization logic
exports.optimizeLogic = async (depotId) => {
  try {
    await Log("backend", "info", "service", "Starting optimization");

    // 🔹 Fetch data
    const depotRes = await apiClient.get("/depots");
    const vehicleRes = await apiClient.get("/vehicles");

    // 🔹 Validate API response
    if (!depotRes.data || !depotRes.data.depots) {
      throw new Error("Invalid depot response structure");
    }

    if (!vehicleRes.data || !vehicleRes.data.vehicles) {
      throw new Error("Invalid vehicle response structure");
    }

    const depots = depotRes.data.depots;
    const vehicles = vehicleRes.data.vehicles;

    // 🔹 Select depot
    const selectedDepot = depots.find((d) => d.ID == depotId);

    if (!selectedDepot) {
      throw new Error("Depot not found");
    }

    const capacity = selectedDepot.MechanicHours;

    // 🔹 Map vehicles → tasks
    const tasks = vehicles.map((v) => ({
      id: v.TaskID,
      duration: v.Duration,
      impact: v.Impact,
    }));

    // 🔹 Edge cases
    if (!capacity || capacity <= 0) {
      await Log("backend", "warn", "service", "Invalid capacity detected");

      return {
        selectedTasks: [],
        totalDuration: 0,
        totalImpact: 0,
      };
    }

    if (!tasks || tasks.length === 0) {
      await Log("backend", "warn", "service", "No tasks available");

      return {
        selectedTasks: [],
        totalDuration: 0,
        totalImpact: 0,
      };
    }

    await Log("backend", "info", "service", `Depot Capacity: ${capacity}`);
    await Log("backend", "debug", "service", `Total tasks: ${tasks.length}`);

    const n = tasks.length;

    // 🔹 DP table
    const dp = Array(n + 1)
      .fill(null)
      .map(() => Array(capacity + 1).fill(0));

    // 🔹 DP computation
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (tasks[i - 1].duration <= w) {
          dp[i][w] = Math.max(
            tasks[i - 1].impact + dp[i - 1][w - tasks[i - 1].duration],
            dp[i - 1][w],
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // 🔹 Backtracking
    let w = capacity;
    let selectedTasks = [];
    let totalDuration = 0;

    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selectedTasks.push(tasks[i - 1].id);
        totalDuration += tasks[i - 1].duration;
        w -= tasks[i - 1].duration;
      }
    }

    // 🔹 Make output stable
    selectedTasks.sort();

    await Log(
      "backend",
      "info",
      "service",
      `Optimization complete. Impact: ${dp[n][capacity]}`,
    );

    await Log(
      "backend",
      "debug",
      "service",
      `Selected tasks count: ${selectedTasks.length}`,
    );

    // 🔹 Final response
    return {
      selectedTasks,
      totalDuration,
      totalImpact: dp[n][capacity],
    };
  } catch (err) {
    await Log("backend", "error", "service", err.message);
    throw err;
  }
};