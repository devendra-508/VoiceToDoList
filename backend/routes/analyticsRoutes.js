const express = require("express");
const { getSummary, getWeekly } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/summary", getSummary);
router.get("/weekly", getWeekly);

module.exports = router;
