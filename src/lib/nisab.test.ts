/// <reference types="node" />
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GOLD_NISAB_G,
  SILVER_NISAB_G,
  TROY_OUNCE_G,
  goldNisabValue,
  livestockDue,
  perGram,
  silverNisabValue,
} from "./nisab.ts";

const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≈ ${b}`);

describe("metal nisab", () => {
  it("converts USD per troy ounce to local currency per gram", () => {
    close(perGram(TROY_OUNCE_G, 1), 1);
    close(perGram(3110.34768, 3.75), 375);
  });

  it("prices 85 g of gold and 595 g of silver", () => {
    close(goldNisabValue(TROY_OUNCE_G, 1), GOLD_NISAB_G);
    close(silverNisabValue(TROY_OUNCE_G, 2), SILVER_NISAB_G * 2);
  });
});

describe("livestockDue", () => {
  it("returns null below the nisab", () => {
    assert.equal(livestockDue("camels", 4), null);
    assert.equal(livestockDue("cows", 29), null);
    assert.equal(livestockDue("sheep", 39), null);
  });

  it("uses the fixed tiers", () => {
    assert.equal(livestockDue("camels", 25)?.en, "1 bint makhāḍ (1-yr she-camel)");
    assert.equal(livestockDue("cows", 45)?.en, "1 musinna (2-yr cow)");
    assert.equal(livestockDue("sheep", 450)?.en, "4 sheep/goats");
  });

  it("camels over 120: a bint labūn per 40, a ḥiqqa per 50", () => {
    assert.equal(livestockDue("camels", 121)?.en, "3 × bint labūn");
    assert.equal(livestockDue("camels", 130)?.en, "2 × bint labūn + 1 × ḥiqqa");
    assert.equal(livestockDue("camels", 150)?.en, "3 × ḥiqqa");
    assert.equal(livestockDue("camels", 200)?.en, "4 × ḥiqqa");
  });

  it("cows from 90: a tabīʿ per 30, a musinna per 40", () => {
    assert.equal(livestockDue("cows", 90)?.en, "3 × tabīʿ");
    assert.equal(livestockDue("cows", 100)?.en, "2 × tabīʿ + 1 × musinna");
    assert.equal(livestockDue("cows", 120)?.en, "3 × musinna");
  });

  it("sheep from 500: one per hundred", () => {
    assert.equal(livestockDue("sheep", 500)?.en, "5 × sheep/goat");
    assert.equal(livestockDue("sheep", 1099)?.en, "10 × sheep/goat");
  });
});
