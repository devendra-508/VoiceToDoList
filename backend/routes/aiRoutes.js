const express = require("express");
const { parseCommandHandler } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/parse-command", parseCommandHandler);

module.exports = router;
