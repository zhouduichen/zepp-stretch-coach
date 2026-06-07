/**
 * Storage service wrapping LocalStorage with prefix and error handling.
 *
 * On Zepp OS v3, LocalStorage is available via @zos/storage.
 * Each key is prefixed to avoid collisions.
 */

import { LocalStorage } from "@zos/storage";

const localStorage = new LocalStorage();

const PREFIX = "sc_";
const CURRENT_SCHEMA_VERSION = 2;

const KEYS = {
  SAFETY_SEEN: "safetySeen",
  VIBRATION_MODE: "vibrationMode",
  RECENT_ROUTINE_ID: "recentRoutineId",
  COMPLETION_COUNT: "completionCount",
  WEEKLY_GOAL: "weeklyGoal",
  SCHEMA_VERSION: "schemaVersion",
  CONTENT_VERSION: "contentVersion"
};

/**
 * Get a value from LocalStorage with error handling.
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
function get(key, defaultValue) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null || raw === undefined) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.log(`Storage read error for "${key}": ${e}`);
    return defaultValue;
  }
}

/**
 * Set a value in LocalStorage.
 * @param {string} key
 * @param {*} value
 */
function set(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.log(`Storage write error for "${key}": ${e}`);
  }
}

/**
 * Migrate storage if schema version is outdated.
 */
function migrate() {
  const storedVersion = get(KEYS.SCHEMA_VERSION, 0);

  if (storedVersion < 1) {
    // V1 migration: ensure all keys exist with defaults
    _ensureDefaults();
    set(KEYS.SCHEMA_VERSION, 1);
  }

  if (storedVersion < 2) {
    // V2 migration: add weeklyGoal default
    if (get(KEYS.WEEKLY_GOAL, null) === null) set(KEYS.WEEKLY_GOAL, 3);
    set(KEYS.SCHEMA_VERSION, 2);
  }
}

function _ensureDefaults() {
  if (get(KEYS.SAFETY_SEEN, null) === null) set(KEYS.SAFETY_SEEN, false);
  if (get(KEYS.VIBRATION_MODE, null) === null) set(KEYS.VIBRATION_MODE, "standard");
  if (get(KEYS.COMPLETION_COUNT, null) === null) set(KEYS.COMPLETION_COUNT, 0);
  if (get(KEYS.WEEKLY_GOAL, null) === null) set(KEYS.WEEKLY_GOAL, 3);
}

export const Storage = {
  get,
  set,
  migrate,
  KEYS,
  PREFIX
};

export { KEYS as STORAGE_KEYS };
