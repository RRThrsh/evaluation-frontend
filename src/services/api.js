const API_BASE = import.meta.env.VITE_API_URL || "";
const CACHE_TTL = 60_000;

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const cache = new Map();

const SENSITIVE_PATTERNS = [
  "/api/admin/users", "/api/admin/students", "/api/auth/me",
  "/api/admin/evaluations", "/api/admin/sessions",
  "/api/admin/pending-users", "/api/admin/permissions",
  "/api/audit-logs", "/api/admin/evaluator-logs",
  "/api/admin/import-logs", "/api/admin/snapshots",
];

function isSensitive(endpoint) {
  return SENSITIVE_PATTERNS.some(p => endpoint.startsWith(p));
}

function getCacheKey(endpoint) {
  return endpoint;
}

function getCached(key) {
  if (isSensitive(key)) return null;
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  if (isSensitive(key)) return;
  cache.set(key, { data, timestamp: Date.now() });
}

function clearCache(prefix) {
  if (prefix) {
    for (const key of cache.keys()) {
      if (key.startsWith(prefix)) cache.delete(key);
    }
  } else {
    cache.clear();
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const isGet = !options.method || options.method === "GET";
  const cacheKey = getCacheKey(endpoint);

  if (isGet) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (res.status === 429) {
    window.location.href = "/429";
    throw new ApiError(429, "Too many requests");
  }

  if (res.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/me") && !endpoint.startsWith("/api/config")) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new ApiError(401, "Session expired");
  }

  if (!res.ok) {
    const msg = data?.error?.message || data?.message || data?.error || `Request failed (${res.status})`;
    throw new ApiError(res.status, msg);
  }

  if (isGet) setCache(cacheKey, data);
  else clearCache(endpoint.split("/").slice(0, 4).join("/"));

  return data;
}

export const api = {
  get: (endpoint, opts = {}) => {
    let url = endpoint;
    if (opts.params) {
      const qs = new URLSearchParams();
      Object.entries(opts.params).forEach(([k, v]) => { if (v !== undefined && v !== "") qs.set(k, v); });
      const str = qs.toString();
      if (str) url += `?${str}`;
    }
    return request(url);
  },
  post: (endpoint, body) => request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint, body) => request(endpoint, { method: "DELETE", body: body ? JSON.stringify(body) : undefined }),
  request,
};

export { ApiError };
export default api;
