const Todo = require("../models/Todo");

const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const [total, completed, pending] = await Promise.all([
      Todo.countDocuments({ user: userId }),
      Todo.countDocuments({ user: userId, completed: true }),
      Todo.countDocuments({ user: userId, completed: false }),
    ]);

    const byCategory = await Todo.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      total,
      completed,
      pending,
      completionRate,
      byCategory: byCategory.map((c) => ({ category: c._id, count: c.count })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWeekly = async (req, res) => {
  try {
    const userId = req.user._id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const completedTodos = await Todo.find({
      user: userId,
      completed: true,
      completedAt: { $gte: sevenDaysAgo },
    });

    const dayLabels = [];
    const counts = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dayLabels.push(key);
      counts[key] = 0;
    }

    completedTodos.forEach((t) => {
      const key = t.completedAt.toISOString().slice(0, 10);
      if (counts[key] !== undefined) counts[key] += 1;
    });

    res.json(dayLabels.map((date) => ({ date, completed: counts[date] })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary, getWeekly };
