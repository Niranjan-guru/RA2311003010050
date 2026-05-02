// variable initialization and imports
const { optimizeLogic } = require("../service/schedulerService");
const { Log } = require("../../../logging_middleware/logger");

// controller function to handle optimization request
exports.optimizeSchedule = async (req, res) => {
  try {
    const { depotId } = req.params;

    await Log("backend", "info", "controller", `Depot ID: ${depotId}`);

    const result = await optimizeLogic(depotId);

    res.status(200).json(result);
  } catch (err) {
    console.error("ERROR: ", err);
    await Log("backend", "error", "controller", err.message);
    res.status(500).json({ error: err.message });
  }
};