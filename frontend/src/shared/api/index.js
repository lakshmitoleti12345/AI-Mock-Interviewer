import api from "./axios";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
  refresh: (refreshToken) => api.post("/auth/refresh", { refresh_token: refreshToken }),
};

export const userApi = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
};

export const resumeApi = {
  upload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/resumes/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  list: () => api.get("/resumes"),
  get: (id) => api.get(`/resumes/${id}`),
  delete: (id) => api.delete(`/resumes/${id}`),
};

export const interviewApi = {
  create: (data) => api.post("/interviews", data),
  list: () => api.get("/interviews"),
  get: (id) => api.get(`/interviews/${id}`),
  submitAnswer: (interviewId, questionId, data) =>
    api.post(`/interviews/${interviewId}/questions/${questionId}/answer`, data),
  complete: (id) => api.post(`/interviews/${id}/complete`),
};

export const dashboardApi = {
  stats: () => api.get("/dashboard/stats"),
};

export const historyApi = {
  list: () => api.get("/history"),
};

export const settingsApi = {
  get: () => api.get("/settings"),
  update: (data) => api.put("/settings", data),
};
