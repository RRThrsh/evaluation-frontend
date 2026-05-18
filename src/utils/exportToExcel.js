import * as XLSX from "xlsx";

function flatten(obj, prefix = "") {
  let result = {};
  for (const key in obj) {
    const val = obj[key];
    const k = prefix + key;
    if (val && typeof val === "object" && !Array.isArray(val) && !(val instanceof Date)) {
      Object.assign(result, flatten(val, k + "_"));
    } else {
      result[k] = val ?? "";
    }
  }
  return result;
}

export default function exportToExcel(data, filename = "export.xlsx", sheetName = "Sheet1") {
  if (!data || data.length === 0) return;
  const flattened = data.map((row) => flatten(row));
  const ws = XLSX.utils.json_to_sheet(flattened);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}
