/**
 * Tests for Select Activity row click target layering.
 * Run with: node --test test/*.test.mjs
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("Select Activity hit targets", () => {
  it("binds row hit targets and visible row widgets to sport selection", () => {
    const source = readFileSync(join(ROOT, "page", "select", "select.js"), "utf8");
    assert.match(source, /const rowTarget = group\.createWidget\(widget\.FILL_RECT/);
    assert.match(source, /rowTarget\.addEventListener\(event\.CLICK_UP,\s*onSportSelect\)/);
    assert.match(source, /sportIcon\.addEventListener\(event\.CLICK_UP,\s*onSportSelect\)/);
    assert.match(source, /sportName\.addEventListener\(event\.CLICK_UP,\s*onSportSelect\)/);
    assert.match(source, /durationHint\.addEventListener\(event\.CLICK_UP,\s*onSportSelect\)/);
    assert.match(source, /recommendTag\.addEventListener\(event\.CLICK_UP,\s*onSportSelect\)/);
  });

  it("uses an explicit scrollable content height", () => {
    const source = readFileSync(join(ROOT, "page", "select", "select.js"), "utf8");
    assert.match(source, /const contentHeight = this\._getContentHeight\(\)/);
    assert.match(source, /h:\s*contentHeight/);
    assert.match(source, /Math\.max\(Styles\.H,\s*height \+ Styles\.BOTTOM_PADDING\)/);
  });
});
