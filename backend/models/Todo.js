const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true, trim: true },
    originalTranscript: { type: String, default: "" },
    language: { type: String, enum: ["en", "hi", "hinglish", "unknown"], default: "unknown" },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    category: {
      type: String,
      enum: ["Health", "Study", "Work", "Errands", "Home", "Travel", "General"],
      default: "General",
    },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: { type: Date, default: null },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
  },
  { timestamps: true }
);

todoSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Todo", todoSchema);
