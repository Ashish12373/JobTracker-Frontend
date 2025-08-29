import api from "./axiosInstance";

export const fetchJobs = () => api.get("/api/jobs").then(r => r.data);
export const createJob = (job) => api.post("/api/jobs", job).then(r => r.data);
export const updateJob = (id, job) => api.put(`/api/jobs/${id}`, job).then(r => r.data);
export const deleteJob = (id) => api.delete(`/api/jobs/${id}`);
