const Todo = require("../models/Todo");
const { parseVoiceCommand } = require("../services/geminiService");

// This is the core "smart" endpoint: takes a raw speech transcript and turns
// it into a real database action (add/delete/complete/query) using Gemini,
// with automatic category detection, time extraction, and recurrence detection.
const parseCommandHandler = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ message: "transcript is required" });
    }

    const parsed = await parseVoiceCommand(transcript);
    let result = { parsed };

    switch (parsed.intent) {
      case "add": {
        let dueDate = null;
        if (parsed.dueTime) {
          const [h, m] = parsed.dueTime.split(":").map(Number);
          const now = new Date();
          dueDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
          if (dueDate < now) dueDate.setDate(dueDate.getDate() + 1);
        }

        const todo = await Todo.create({
          user: req.user._id,
          text: parsed.taskText,
          originalTranscript: transcript,
          language: parsed.language || "unknown",
          category: parsed.category || "General",
          priority: parsed.priority || "medium",
          isRecurring: !!parsed.isRecurring,
          recurrencePattern: parsed.recurrencePattern || "none",
          dueDate,
        });

        const io = req.app.get("io");
        if (io) io.to(req.user._id.toString()).emit("todo:created", todo);

        result.action = "created";
        result.todo = todo;
        break;
      }

      case "delete": {
        if (parsed.taskIndex === null || parsed.taskIndex === undefined) {
          result.action = "error";
          result.message = "Could not determine which task to delete";
          break;
        }
        const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: 1 });
        const target = todos[parsed.taskIndex - 1];
        if (!target) {
          result.action = "error";
          result.message = `Task ${parsed.taskIndex} not found`;
          break;
        }
        await Todo.deleteOne({ _id: target._id });

        const io = req.app.get("io");
        if (io) io.to(req.user._id.toString()).emit("todo:deleted", { _id: target._id });

        result.action = "deleted";
        result.todo = target;
        break;
      }

      case "complete": {
        if (parsed.taskIndex === null || parsed.taskIndex === undefined) {
          result.action = "error";
          result.message = "Could not determine which task to complete";
          break;
        }
        const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: 1 });
        const target = todos[parsed.taskIndex - 1];
        if (!target) {
          result.action = "error";
          result.message = `Task ${parsed.taskIndex} not found`;
          break;
        }
        target.completed = true;
        target.completedAt = new Date();
        await target.save();

        const io = req.app.get("io");
        if (io) io.to(req.user._id.toString()).emit("todo:updated", target);

        result.action = "completed";
        result.todo = target;
        break;
      }

      case "query": {
        const pending = await Todo.countDocuments({ user: req.user._id, completed: false });
        const total = await Todo.countDocuments({ user: req.user._id });
        result.action = "query";
        result.message = `You have ${pending} pending task${pending === 1 ? "" : "s"} out of ${total} total.`;
        break;
      }

      default:
        result.action = "unknown";
        result.message = "Sorry, I did not understand that command.";
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { parseCommandHandler };
