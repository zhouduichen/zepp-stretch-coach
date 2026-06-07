/**
 * Tests for recommendation engine.
 * Run with: node --test test/*.test.mjs
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import {
  recommendRoutine,
  estimateDuration,
  recommendFromRecentWorkout
} from "../core/recommendation.js";
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

  describe("recommendFromRecentWorkout", () => {
    it("builds a direct full routine recommendation from the last workout sport and duration", () => {
      const result = recommendFromRecentWorkout({
        hasWorkout: true,
        sportId: "cycle-indoor",
        durationSeconds: 3600
      });

      assert.ok(result, "Should return a clickable recommendation");
      assert.strictEqual(result.sportId, "cycle-indoor");
      assert.strictEqual(result.routineType, "full");
      assert.strictEqual(result.source, "last-workout");
      assert.ok(result.durationMinutes > 0, "Should expose a visible duration estimate");
      assert.ok(result.steps.length > 0, "Should include resolved session steps");
    });

    it("falls back to a default sport while preserving the duration-based routine type", () => {
      const result = recommendFromRecentWorkout({
        hasWorkout: true,
        sportId: "unknown",
        durationSeconds: 600
      });

      assert.ok(result, "Should still return a one-tap fallback recommendation");
      assert.strictEqual(result.sportId, "run-outdoor");
      assert.strictEqual(result.routineType, "quick");
      assert.strictEqual(result.source, "fallback");
    });
  });
});
