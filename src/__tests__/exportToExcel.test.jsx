import { describe, it, expect, vi } from "vitest";
import exportToExcel from "../utils/exportToExcel";

const { writeFile, json_to_sheet, book_new, book_append_sheet } = vi.hoisted(() => ({
  writeFile: vi.fn(),
  json_to_sheet: vi.fn(() => ({})),
  book_new: vi.fn(() => ({})),
  book_append_sheet: vi.fn(),
}));

vi.mock("xlsx", () => {
  const utils = { json_to_sheet, book_new, book_append_sheet };
  return { default: { utils, writeFile }, utils, writeFile };
});

describe("exportToExcel", () => {
  it("does nothing with empty data", () => {
    exportToExcel([], "test.xlsx");
    expect(writeFile).not.toHaveBeenCalled();
  });

  it("calls writeFile with valid data", () => {
    exportToExcel([{ name: "John", age: 25 }], "test.xlsx", "Sheet1");
    expect(writeFile).toHaveBeenCalledWith(expect.any(Object), "test.xlsx");
  });

  it("flattens nested objects", () => {
    const data = [{ user: { name: "John", details: { age: 25 } }, id: 1 }];
    exportToExcel(data, "test.xlsx");
    expect(json_to_sheet).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ user_name: "John", user_details_age: 25, id: 1 }),
      ])
    );
  });
});
