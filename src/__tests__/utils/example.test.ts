import { describe, it, expect } from "vitest";

// Przykładowa funkcja do testowania
function formatCardName(name: string, maxLength = 30): string {
  if (!name) return "";
  if (name.length <= maxLength) return name;
  return `${name.substring(0, maxLength)}...`;
}

describe("formatCardName", () => {
  it("returns empty string for empty input", () => {
    expect(formatCardName("")).toBe("");
  });

  it("returns the original string if it is shorter than maxLength", () => {
    const input = "Short name";
    expect(formatCardName(input)).toBe(input);
  });

  it("truncates the string and adds ellipsis if longer than maxLength", () => {
    const input = "This is a very long name that should be truncated";
    const expected = "This is a very long name that ...";
    expect(formatCardName(input, 30)).toBe(expected);
  });

  it("respects custom maxLength parameter", () => {
    const input = "Long name";
    const expected = "Long...";
    expect(formatCardName(input, 4)).toBe(expected);
  });
});
