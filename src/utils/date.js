const PH_TIMEZONE = "Asia/Manila";

export function toPHDate(date) {
  if (!date) return "\u2014";
  return new Date(date).toLocaleDateString("en-US", { timeZone: PH_TIMEZONE });
}

export function toPHString(date) {
  if (!date) return "\u2014";
  return new Date(date).toLocaleString("en-US", { timeZone: PH_TIMEZONE });
}

export function toPHTime(date) {
  if (!date) return "\u2014";
  return new Date(date).toLocaleTimeString("en-US", { timeZone: PH_TIMEZONE, hour: "2-digit", minute: "2-digit" });
}

export function toPHLongDate(date) {
  if (!date) return "\u2014";
  return new Date(date).toLocaleDateString("en-US", { timeZone: PH_TIMEZONE, year: "numeric", month: "long", day: "numeric" });
}
