/**
 * Tests for content configuration validation.
 * Run with: node --test test/*.test.mjs
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { validateAll } from "../core/content-validator.js";

describe("Content Validator", () => {
  it("should pass with no errors for current configuration", () => {
    const errors = validateAll();
    assert.strictEqual(errors.length, 0, `Expected no validation errors, got:\n${errors.map(e => `  - ${e}`).join("\n")}`);
  });
});
