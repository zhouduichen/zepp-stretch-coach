/**
 * Tests for Zepp OS text alignment constants used by page layouts.
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const CENTERED_LAYOUTS = [
  "page/complete/complete.r.layout.js",
  "page/complete/complete.s.layout.js",
  "page/home/home.r.layout.js",
  "page/home/home.s.layout.js",
  "page/safety/safety.r.layout.js",
  "page/safety/safety.s.layout.js",
  "page/select/select.r.layout.js",
  "page/select/select.s.layout.js",
  "page/session/session.r.layout.js",
  "page/session/session.s.layout.js",
  "page/settings/settings.r.layout.js",
  "page/settings/settings.s.layout.js"
];

describe("layout text alignment", () => {
  it("uses named Zepp alignment constants instead of bare numbers", () => {
    for (const relativePath of CENTERED_LAYOUTS) {
      const source = readFileSync(join(ROOT, relativePath), "utf8");
      assert.doesNotMatch(
        source,
        /align_h:\s*\d/,
        `${relativePath} uses a bare align_h number; use align.LEFT or align.CENTER_H`
      );
      assert.doesNotMatch(
        source,
        /align_v:\s*\d/,
        `${relativePath} uses a bare align_v number; use align.CENTER_V`
      );
      assert.match(
        source,
        /from\s+['"]@zos\/ui['"]/,
        `${relativePath} should import Zepp's named align constants from @zos/ui`
      );
    }
  });
});
