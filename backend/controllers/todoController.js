const Todo = require("../models/Todo");

// Emits real-time updates to the user's own socket room so multiple
// open tabs/devices stay in sync — this is wired up in sockets/socket.js
const emitUpdate = (req, event, payload) => {
  const io = req.app.get("io");
  if (io) io.to(req.user._id.toString()).emit(event, payload);
};

const getTodos = async (req, res) => {
  try {
    const { search, category, completed } = req.query;
    const filter = { user: req.user._id };

    if (search) filter.text = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (completed !== undefined) filter.completed = completed === "true";

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTodo = async (req, res) => {
  try {
    const todo = await Todo.create({ ...req.body, user: req.user._id });
    emitUpdate(req, "todo:created", todo);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    emitUpdate(req, "todo:updated", todo);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? new Date() : null;
    await todo.save();

    emitUpdate(req, "todo:updated", todo);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    emitUpdate(req, "todo:deleted", { _id: req.params.id });
    res.json({ message: "Todo deleted", _id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTodos, createTodo, updateTodo, toggleTodo, deleteTodo };
