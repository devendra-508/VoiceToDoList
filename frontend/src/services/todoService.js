import api from "./api";

const getTodos = (params) => api.get("/todos", { params }).then((r) => r.data);
const createTodo = (payload) => api.post("/todos", payload).then((r) => r.data);
const updateTodo = (id, payload) => api.put(`/todos/${id}`, payload).then((r) => r.data);
const toggleTodo = (id) => api.patch(`/todos/${id}/toggle`).then((r) => r.data);
const deleteTodo = (id) => api.delete(`/todos/${id}`).then((r) => r.data);

const parseVoiceCommand = (transcript) =>
  api.post("/ai/parse-command", { transcript }).then((r) => r.data);

const getAnalyticsSummary = () => api.get("/analytics/summary").then((r) => r.data);
const getWeeklyAnalytics = () => api.get("/analytics/weekly").then((r) => r.data);

export default {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  parseVoiceCommand,
  getAnalyticsSummary,
  getWeeklyAnalytics,
};
