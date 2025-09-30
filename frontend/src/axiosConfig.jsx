import axios from "axios";

// Derive backend base URL
// Priority: REACT_APP_API_URL env -> window.__API_BASE__ (optional global) -> same host different port (5001) -> fallback 5000
const inferredBase = (() => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (typeof window !== "undefined" && window.__API_BASE__)
    return window.__API_BASE__;
  // If frontend runs on 3000 (CRA), backend likely on 5001 (per server.js) unless overridden
  if (
    typeof window !== "undefined" &&
    window.location &&
    /:3000$/.test(window.location.origin)
  ) {
    return window.location.origin.replace(":3000", ":5001");
  }
  return "http://localhost:5001";
})();

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: inferredBase,
  headers: { "Content-Type": "application/json" },
});

// Proactive connectivity check (non-blocking)
if (typeof window !== "undefined") {
  (async () => {
    try {
      await fetch(inferredBase + "/api/health", { method: "GET" });
    } catch (e) {
      console.warn(
        "[axios][startup] Cannot reach API base:",
        inferredBase,
        e.message,
      );
    }
  })();
}

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (/\/auth\/register$/.test(config.url || "")) {
      // Shallow clone & mask sensitive fields
      const payload =
        typeof config.data === "string"
          ? config.data
          : { ...(config.data || {}) };
      if (payload.password) payload.password = "***";
      console.log("[axios][register][request]", {
        baseURL: config.baseURL,
        url: config.url,
        method: config.method,
        data: payload,
      });
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    if (/\/auth\/register$/.test(url)) {
      console.warn("[axios][register][response][error]", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    if (error.response?.status === 401) {
      if (!/\/auth\/(login|register)/.test(url)) {
        localStorage.removeItem("token");
        delete axiosInstance.defaults.headers.common["Authorization"];
        if (typeof window !== "undefined") window.location.replace("/login");
      }
    }
    if (error.response?.data && !error.response.data.normalizedMessage) {
      error.response.data.normalizedMessage =
        error.response.data.message || "Request failed";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
