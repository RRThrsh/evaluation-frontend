export function sanitizeInput(value) {
  if (typeof value !== "string") return value;
  return value.replace(/[<>"'&]/g, "").trim();
}

export function sanitizeObject(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "string") {
      sanitized[key] = sanitizeInput(obj[key]);
    } else if (typeof obj[key] === "object") {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
}
