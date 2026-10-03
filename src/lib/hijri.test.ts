/// <reference types="node" />
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DAY_MS, formatDays, hijriAnniversary, nextHawl, parseDay, toHijri } from "./hijri.ts";

const MUHARRAM_1448 = Date.UTC(2026, 5, 16);

describe("hijri", () => {
  it("converts to the Umm al-Qura calendar", () => {
    assert.deepEqual(toHijri(MUHARRAM_1448), { y: 1448, m: 1, d: 1 });
  });

  it("parses YYYY-MM-DD as UTC midnight", () => {
    assert.equal(parseDay("2026-06-16"), MUHARRAM_1448);
    assert.equal(parseDay("16/06/2026"), null);
  });

  it("finds the same Hijri day a lunar year later", () => {
    const next = hijriAnniversary(MUHARRAM_1448, 1);
    assert.deepEqual(toHijri(next), { y: 1449, m: 1, d: 1 });
    const days = (next - MUHARRAM_1448) / DAY_MS;
    assert.ok(days >= 354 && days <= 355, `${days} days`);
    assert.deepEqual(toHijri(hijriAnniversary(MUHARRAM_1448, 10)), { y: 1458, m: 1, d: 1 });
  });

  it("falls back to the month's last day when the day does not exist", () => {
    const start = Date.UTC(2026, 5, 16) + 29 * DAY_MS; // 30 Muharram 1448, if it exists
    const h = toHijri(start);
    const next = toHijri(hijriAnniversary(start, 1));
    assert.equal(next.y, h.y + 1);
    assert.ok(next.m === h.m || next.d <= h.d);
  });

  it("returns the next due date on or after today", () => {
    const now = MUHARRAM_1448 + 400 * DAY_MS;
    assert.deepEqual(toHijri(nextHawl(MUHARRAM_1448, now)), { y: 1450, m: 1, d: 1 });
    assert.equal(nextHawl(MUHARRAM_1448, now, true), Date.UTC(2028, 5, 16));
  });
});

describe("formatDays", () => {
  it("uses Arabic plural forms", () => {
    assert.equal(formatDays(1, "ar"), "يوم واحد");
    assert.equal(formatDays(2, "ar"), "يومان");
    assert.equal(formatDays(10, "ar"), "10 أيام");
    assert.equal(formatDays(254, "ar"), "254 يوماً");
    assert.equal(formatDays(100, "ar"), "100 يوم");
    assert.equal(formatDays(30, "ar"), "30 يوماً");
    assert.equal(formatDays(30, "en"), "30");
  });
});
