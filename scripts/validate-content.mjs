/**
 * Content configuration validation script.
 * Usage: node scripts/validate-content.mjs
 *
 * Checks:
 * - Duplicate IDs across all content types
 * - Dangling exercise references in routines
 * - Outdoor routines using support-required exercises
 * - Missing source references
 * - Anomalous durations
 * - Sport-category references
 */

import { validateAll } from "../core/content-validator.js";

const errors = validateAll();

if (errors.length === 0) {
  console.log("✅ All content validation passed.");
  process.exit(0);
} else {
  console.log(`❌ Found ${errors.length} validation error(s):\n`);
  for (const err of errors) {
    console.log(`  - ${err}`);
  }
  process.exit(1);
}
