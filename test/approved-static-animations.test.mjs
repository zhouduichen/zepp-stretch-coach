/**
 * Tests for approved static animation asset contracts.
 * Run with: node --test test/*.test.mjs
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../data/exercises.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = ["gt.r", "gt.s"];

describe("approved static animations", () => {
  it("uses the approved 8-frame soft muscle pulse for quad stretches", () => {
    const quadExercises = EXERCISES.filter(exercise => exercise.animPrefix === "quad");

    assert.ok(quadExercises.length > 0, "Expected at least one quad exercise");
    for (const exercise of quadExercises) {
      assert.strictEqual(
        exercise.animFrames,
        8,
        `${exercise.id} should play all approved quad pulse frames`
      );
    }

    for (const target of TARGETS) {
      for (let frame = 0; frame < 8; frame += 1) {
        const path = join(ROOT, "assets", target, "animations", "quad", `f_${frame}.png`);
        assert.ok(existsSync(path), `Missing approved quad frame: ${path}`);
        assert.ok(statSync(path).size > 0, `Empty approved quad frame: ${path}`);
      }
    }
  });
});
