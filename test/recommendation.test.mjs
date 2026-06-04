/**
 * Tests for recommendation engine.
 * Run with: node --test test/*.test.mjs
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { recommendRoutine, estimateDuration } from "../core/recommendation.js";
import { getExercise } from "../data/exercises.js";

describe("Recommendation Engine", () => {
  describe("recommendRoutine", () => {
    it("should return a routine for run-outdoor", () => {
      const result = recommendRoutine("run-outdoor", 1200);
      assert.ok(result, "Should find a routine");
      assert.ok(result.routine, "Should have routine");
      assert.ok(result.steps.length > 0, "Should have steps");
    });

    it("should return quick for short workouts", () => {
      const result = recommendRoutine("run-outdoor", 600);
      assert.strictEqual(result.routine.type, "quick");
    });

    it("should return full for long workouts", () => {
      const result = recommendRoutine("run-outdoor", 3600);
      assert.strictEqual(result.routine.type, "full");
    });

    it("should return null for unknown sport", () => {
      const result = recommendRoutine("unknown-sport", 1200);
      assert.strictEqual(result, null);
    });

    it("should resolve exercise durations", () => {
      const result = recommendRoutine("run-outdoor", 1200);
      const ex = getExercise(result.steps[0].exerciseId);
      assert.ok(ex, "Exercise should exist in definitions");
    });
  });

  describe("estimateDuration", () => {
    it("should return a positive duration", () => {
      const result = recommendRoutine("run-outdoor", 1200);
      const duration = estimateDuration(result.steps);
      assert.ok(duration > 0, "Duration should be positive");
    });

    it("should count an explicit side only once", () => {
      const duration = estimateDuration([
        { exerciseId: "standing-quad-stretch", side: "left", duration: 30 }
      ]);
      assert.strictEqual(duration, 33);
    });
  });
});
