const express = require("express");
const router = express.Router();

const { optimizeSchedule } = require("../controller/schedulerController");

router.get("/optimize/:depotId", optimizeSchedule);

module.exports = router;