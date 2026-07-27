const express = require("express");
const {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} = require("../controllers/todoController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getTodos).post(createTodo);
router.route("/:id").put(updateTodo).delete(deleteTodo);
router.patch("/:id/toggle", toggleTodo);

module.exports = router;
