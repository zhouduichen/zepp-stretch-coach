/**
 * Tests for generated asset pipeline contracts.
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("asset generator contracts", () => {
  it("centers button labels from measured text bounds", () => {
    const source = readFileSync(join(ROOT, "scripts", "generate-assets.ps1"), "utf8");

    assert.match(source, /function Draw-CenteredText/);
    assert.match(source, /MeasureCharacterRanges/);
    assert.doesNotMatch(
      source,
      /\$graphics\.DrawString\(\$label,\s*\$font,\s*\$textBrush,\s*\$rect,\s*\$format\)/,
      "Label buttons should not rely on DrawString rectangle centering, which is visually offset by font metrics."
    );
  });

  it("uses the B-style symbol source library for exercise animations", () => {
    const generatorPath = join(ROOT, "scripts", "generate-b-style-animations.ps1");
    const mainSource = readFileSync(join(ROOT, "scripts", "generate-assets.ps1"), "utf8");

    assert.ok(existsSync(generatorPath), "Missing B-style animation generator");
    assert.match(mainSource, /generate-b-style-animations\.ps1/);
    assert.doesNotMatch(
      mainSource,
      /Draw-AnimationFrame\s+\$path/,
      "Main asset generation should not emit legacy stick-figure frames before B-style frames."
    );
  });
});
