/**
 * Tests for Session page visual layout contracts.
 * Run with: node --test test/*.test.mjs
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function readSessionLayout(shape) {
  return readFileSync(join(ROOT, "page", "session", `session.${shape}.layout.js`), "utf8");
}

function evalPxExpression(expr) {
  assert.match(expr, /^[\d\s+\-*/().]+$/, `Unsafe px expression: ${expr}`);
  return Function(`"use strict"; return (${expr});`)();
}

function styleValue(source, styleName, propName) {
  const styleMatch = source.match(new RegExp(`export const ${styleName} = \\{([\\s\\S]*?)\\};`));
  assert.ok(styleMatch, `Missing style ${styleName}`);

  const pxMatch = styleMatch[1].match(new RegExp(`${propName}:\\s*px\\(([^)]+)\\)`));
  if (pxMatch) return evalPxExpression(pxMatch[1]);

  const rawMatch = styleMatch[1].match(new RegExp(`${propName}:\\s*([-\\d.]+)`));
  assert.ok(rawMatch, `Missing ${styleName}.${propName}`);
  return Number(rawMatch[1]);
}

describe("Session page layout", () => {
  it("keeps the B-style exercise animation out of text and controls", () => {
    for (const shape of ["r", "s"]) {
      const layout = readSessionLayout(shape);

      const progressBottom = styleValue(layout, "PROGRESS_STYLE", "y")
        + styleValue(layout, "PROGRESS_STYLE", "h");
      const animationTop = styleValue(layout, "ANIM_STYLE", "y");
      assert.ok(
        animationTop - progressBottom >= 12,
        `${shape}: animation must leave at least 12px below progress text`
      );

      const animationBottom = animationTop + styleValue(layout, "ANIM_STYLE", "h");
      const pauseTop = styleValue(layout, "PAUSE_BTN_STYLE", "y");
      assert.ok(
        pauseTop - animationBottom >= 16,
        `${shape}: pause button must leave at least 16px after animation`
      );
    }
  });

  it("renders the source sprites at their native 4:3 aspect ratio", () => {
    for (const shape of ["r", "s"]) {
      const layout = readSessionLayout(shape);
      const width = styleValue(layout, "ANIM_STYLE", "w");
      const height = styleValue(layout, "ANIM_STYLE", "h");

      assert.equal(
        Math.round((width / height) * 1000),
        Math.round((4 / 3) * 1000),
        `${shape}: animation frame should keep the 320x240 source aspect ratio`
      );
    }
  });
});
