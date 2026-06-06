/**
 * Tests for left/right exercise animation variants.
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../data/exercises.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = ["gt.r", "gt.s"];

function singleSideAnimationCounts() {
  const counts = new Map();
  for (const exercise of EXERCISES) {
    if (exercise.sides !== "single") continue;
    const previous = counts.get(exercise.animPrefix) || 0;
    counts.set(exercise.animPrefix, Math.max(previous, exercise.animFrames));
  }
  return counts;
}

describe("side-specific animations", () => {
  it("generates left and right frame folders for every single-side animation", () => {
    for (const target of TARGETS) {
      for (const [prefix, count] of singleSideAnimationCounts()) {
        for (const side of ["left", "right"]) {
          for (let index = 0; index < count; index += 1) {
            const path = join(ROOT, "assets", target, "animations", `${prefix}_${side}`, `f_${index}.png`);
            assert.ok(existsSync(path), `Missing ${side} animation frame: ${path}`);
            assert.ok(statSync(path).size > 0, `Empty ${side} animation frame: ${path}`);
          }
        }
      }
    }
  });

  it("uses mirrored files and reloads the animation when the active side changes", () => {
    const generator = readFileSync(join(ROOT, "scripts", "generate-b-style-animations.ps1"), "utf8");
    const session = readFileSync(join(ROOT, "page", "session", "session.js"), "utf8");

    assert.match(generator, /SingleSidePrefixes/);
    assert.match(generator, /RotateNoneFlipX/);
    assert.match(session, /_resolveAnimationPrefix\(ex,\s*side\)/);
    assert.match(session, /this\._loadAnimation\(info\.exerciseId,\s*info\.side\)/);
    assert.match(session, /info\.action === "side_switch" \|\| info\.action === "side_start"/);
  });
});
