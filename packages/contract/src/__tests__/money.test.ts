import { describe, it, expect } from "vitest";
import { formatMoney } from "../money";

describe("Money: formatMoney", () => {
  it("formats MXN correctly (2 decimal places)", () => {
    const money = { amountMinor: 129990, currency: "MXN" as const };
    const result = formatMoney(money, "es-MX");
    // es-MX uses $ for MXN
    expect(result).toMatch(/1,299\.90/);
    expect(result).toContain("$");
  });

  it("formats USD correctly (2 decimal places)", () => {
    const money = { amountMinor: 5000, currency: "USD" as const };
    const result = formatMoney(money, "en-US");
    expect(result).toMatch(/50\.00/);
    expect(result).toContain("$");
  });

  it("formats JPY correctly (0 decimal places)", () => {
    const money = { amountMinor: 1500, currency: "JPY" as const };
    const result = formatMoney(money, "ja-JP");
    expect(result).toMatch(/1,500/);
    expect(result).not.toMatch(/1,500\./);
  });

  it("formats KWD correctly (3 decimal places)", () => {
    const money = { amountMinor: 1234567, currency: "KWD" as const };
    // Using en-KW to test latin numerals for decimal places
    const result = formatMoney(money, "en-KW");
    expect(result).toMatch(/1,234\.567/);
  });
});
