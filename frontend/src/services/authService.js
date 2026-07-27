import api from "./api";

const register = (payload) => api.post("/auth/register", payload).then((r) => r.data);
const login = (payload) => api.post("/auth/login", payload).then((r) => r.data);
const getMe = () => api.get("/auth/me").then((r) => r.data);

export default { register, login, getMe };
