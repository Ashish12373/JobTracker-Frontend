import api from "./axiosInstance";

export const login = (username, password) =>
  api.post("/auth/login", { username, password }).then((res) => res.data);

export const register = (username, name, email, password) =>
  api.post("/auth/signup", { username, name, email, password }).then((res) => res.data);
