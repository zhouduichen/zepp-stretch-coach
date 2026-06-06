/**
 * Tests for Select Activity row click target layering.
 * Run with: node --test test/*.test.mjs
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIES } from "../data/categories.js";
import { SPORTS } from "../data/sports.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function readSelectLayout(shape) {
  return readFileSync(join(ROOT, "page", "select", `select.${shape}.layout.js`), "utf8");
}

function pxValue(source, styleName, propName) {
  const styleMatch = source.match(new RegExp(`export const ${styleName} = \\{([\\s\\S]*?)\\};`));
  assert.ok(styleMatch, `Missing style ${styleName}`);

  const propMatch = styleMatch[1].match(new RegExp(`${propName}:\\s*px\\(([-\\d.]+)\\)`));
  if (propMatch) return Number(propMatch[1]);

  const rawMatch = styleMatch[1].match(new RegExp(`${propName}:\\s*([-\\d.]+)`));
  assert.ok(rawMatch, `Missing ${styleName}.${propName}`);
  return Number(rawMatch[1]);
}

function exportedPxValue(source, name) {
  const match = source.match(new RegExp(`export const ${name} = px\\(([-\\d.]+)\\);`));
  assert.ok(match, `Missing ${name}`);
  return Number(match[1]);
}

function roundSafeLeft(y, h, size) {
  const radius = size / 2;
  const centerY = y + h / 2;
  const dy = Math.abs(centerY - radius);
  return radius - Math.sqrt((radius * radius) - (dy * dy));
}

function pngSize(path) {
  const data = readFileSync(path);
  assert.equal(data.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", `${path} is not a PNG`);
  return {
    w: data.readUInt32BE(16),
    h: data.readUInt32BE(20)
  };
}

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

  it("keeps Select Activity icons, labels, and tags from overlapping", () => {
    for (const shape of ["r", "s"]) {
      const layout = readSelectLayout(shape);

      const categoryIconRight = pxValue(layout, "CATEGORY_ICON_STYLE", "x")
        + pxValue(layout, "CATEGORY_ICON_STYLE", "w");
      const categoryTextX = pxValue(layout, "CATEGORY_TEXT_STYLE", "x");
      assert.ok(
        categoryTextX - categoryIconRight >= 24,
        `${shape}: category label must leave at least 24px after icon`
      );

      const sportIconRight = pxValue(layout, "SPORT_ICON_STYLE", "x")
        + pxValue(layout, "SPORT_ICON_STYLE", "w");
      const sportTextX = pxValue(layout, "ITEM_TEXT_STYLE", "x");
      assert.ok(
        sportTextX - sportIconRight >= 30,
        `${shape}: sport label must leave at least 30px after icon`
      );

      const sportTextRight = sportTextX + pxValue(layout, "ITEM_TEXT_STYLE", "w");
      const tagX = pxValue(layout, "RECOMMEND_TAG_STYLE", "x");
      assert.ok(
        tagX - sportTextRight >= 24,
        `${shape}: sport label must leave at least 24px before tag`
      );

      const itemTextY = pxValue(layout, "ITEM_TEXT_STYLE", "y");
      const itemTextHeight = pxValue(layout, "ITEM_TEXT_STYLE", "h");
      const itemSubY = pxValue(layout, "ITEM_SUB_STYLE", "y");
      assert.ok(
        itemSubY >= itemTextY + itemTextHeight - 6,
        `${shape}: duration hint must sit below the sport label`
      );

      const tagY = pxValue(layout, "RECOMMEND_TAG_STYLE", "y");
      const tagHeight = pxValue(layout, "RECOMMEND_TAG_STYLE", "h");
      const rowHeight = pxValue(layout, "ROW_BG_STYLE", "h");
      assert.ok(
        tagY > 0 && tagY + tagHeight < rowHeight,
        `${shape}: recommendation tag must be vertically centered within the row`
      );
    }
  });

  it("keeps round-screen category icons inside the visible circular safe area", () => {
    const layout = readSelectLayout("r");
    const iconX = pxValue(layout, "CATEGORY_ICON_STYLE", "x");
    const iconY = exportedPxValue(layout, "LIST_START_Y")
      + pxValue(layout, "CATEGORY_ICON_STYLE", "y")
      + exportedPxValue(layout, "CATEGORY_ICON_OFFSET_Y");
    const iconH = pxValue(layout, "CATEGORY_ICON_STYLE", "h");
    const screenW = exportedPxValue(layout, "W");
    const safeLeft = roundSafeLeft(iconY, iconH, screenW);

    assert.ok(
      iconX >= safeLeft + 8,
      `r: category icon starts at ${iconX}px, but the round-screen safe edge is ${safeLeft.toFixed(1)}px`
    );
  });

  it("uses native-size icon resources so Zepp IMG widgets do not crop them", () => {
    for (const shape of ["r", "s"]) {
      const layout = readSelectLayout(shape);
      const target = shape === "r" ? "gt.r" : "gt.s";
      const categorySize = {
        w: pxValue(layout, "CATEGORY_ICON_STYLE", "w"),
        h: pxValue(layout, "CATEGORY_ICON_STYLE", "h")
      };
      const sportSize = {
        w: pxValue(layout, "SPORT_ICON_STYLE", "w"),
        h: pxValue(layout, "SPORT_ICON_STYLE", "h")
      };

      for (const category of CATEGORIES) {
        assert.deepEqual(
          pngSize(join(ROOT, "assets", target, `${category.icon}.png`)),
          categorySize,
          `${shape}: ${category.icon}.png must match CATEGORY_ICON_STYLE to avoid cropping`
        );
      }

      for (const icon of new Set(SPORTS.map(sport => sport.icon))) {
        assert.deepEqual(
          pngSize(join(ROOT, "assets", target, `${icon}.png`)),
          sportSize,
          `${shape}: ${icon}.png must match SPORT_ICON_STYLE to avoid cropping`
        );
      }
    }
  });

  it("applies relative vertical offsets when rendering Select Activity row text", () => {
    const source = readFileSync(join(ROOT, "page", "select", "select.js"), "utf8");

    assert.match(source, /y:\s*itemY \+ Styles\.ITEM_TEXT_STYLE\.y/);
    assert.match(source, /y:\s*itemY \+ Styles\.ITEM_SUB_STYLE\.y/);
    assert.match(source, /y:\s*itemY \+ Styles\.RECOMMEND_TAG_STYLE\.y/);
  });
});
