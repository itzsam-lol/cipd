import axios from "axios";

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;
const STORAGE_KEY = "cipd-auth-token";

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY);
    }
    return Promise.reject(err);
  },
);

export function saveToken(token) {
  localStorage.setItem(STORAGE_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(STORAGE_KEY);
}
export function getToken() {
  return localStorage.getItem(STORAGE_KEY);
}

export function formatApiError(err, fallback = "Something went wrong") {
  const detail = err?.response?.data?.detail;
  if (!detail) return err?.message || fallback;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  return String(detail);
}

export function fileUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  if (pathOrUrl.startsWith("/api/")) return `${process.env.REACT_APP_BACKEND_URL}${pathOrUrl}`;
  return pathOrUrl;
}
