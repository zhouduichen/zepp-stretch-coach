/**
 * Workout history service.
 *
 * Reads the most recent workout from Workout.getHistory() and
 * uses its duration to recommend quick or full stretching routine.
 *
 * IMPORTANT: Workout.getHistory() does NOT guarantee ordering.
 * We must find the entry with the largest startTime.
 */

import { Workout } from "@zos/sensor";
import { SPORTS } from "../data/sports";

const workout = new Workout();

const SPORT_HINTS = [
  { sportId: "run-indoor", keywords: ["treadmill", "indoor run", "indoor running", "run indoor"] },
  { sportId: "run-outdoor", keywords: ["outdoor run", "outdoor running", "running", "run"] },
  { sportId: "cycle-indoor", keywords: ["spin", "spinning", "indoor cycle", "indoor cycling", "bike indoor"] },
  { sportId: "cycle-outdoor", keywords: ["outdoor cycle", "outdoor cycling", "cycling", "cycle", "bike"] },
  { sportId: "strength-lower", keywords: ["lower body", "leg strength", "legs"] },
  { sportId: "strength-upper", keywords: ["upper body", "strength", "weights", "weight training"] },
  { sportId: "bodyweight-outdoor", keywords: ["outdoor bodyweight", "outdoor calisthenics"] },
  { sportId: "bodyweight-indoor", keywords: ["bodyweight", "calisthenics"] },
  { sportId: "basketball", keywords: ["basketball"] },
  { sportId: "soccer", keywords: ["soccer", "football"] },
  { sportId: "tennis", keywords: ["tennis"] },
  { sportId: "badminton", keywords: ["badminton"] }
];

const SUBTYPE_SPORT_IDS = {
  "1": "run-outdoor",
  "2": "run-indoor",
  "4": "cycle-outdoor",
  "8": "cycle-indoor",
  "17": "tennis",
  "18": "soccer",
  "52": "strength-upper",
  "85": "basketball",
  "92": "badminton",
  "109": "strength-upper",
  "143": "cycle-indoor"
};

function isKnownSportId(value) {
  return SPORTS.some(sport => sport.id === value);
}

function normalize(value) {
  return `${value}`.toLowerCase().replace(/[_-]+/g, " ").trim();
}

function collectText(value, parts) {
  if (value === null || value === undefined) return;

  if (typeof value === "object") {
    const keys = ["id", "type", "sportId", "sportType", "name", "title"];
    for (const key of keys) {
      if (value[key] !== undefined) collectText(value[key], parts);
    }
    return;
  }

  parts.push(normalize(value));
}

function resolveSubtypeSportId(value) {
  if (value === null || value === undefined || typeof value === "object") return null;
  return SUBTYPE_SPORT_IDS[`${value}`] || null;
}

function getDurationSeconds(entry) {
  if (!entry) return 0;
  const duration = entry.duration !== undefined
    ? entry.duration
    : (entry.durationSeconds !== undefined
      ? entry.durationSeconds
      : (entry.totalDuration !== undefined ? entry.totalDuration : entry.elapsedTime || 0));
  const numeric = Number(duration);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}

function findLatestWorkout(history) {
  let best = history[0];
  for (let i = 1; i < history.length; i++) {
    if ((history[i].startTime || 0) > (best.startTime || 0)) {
      best = history[i];
    }
  }
  return best;
}

/**
 * Resolve an app sport ID from a workout history entry when the device returns
 * additional sport metadata. Official history fields are startTime/duration, so
 * this is intentionally conservative and can return null.
 *
 * @param {object} entry
 * @returns {string|null}
 */
export function resolveWorkoutSportId(entry) {
  if (!entry) return null;

  const fields = [
    "sportId",
    "sport_id",
    "workoutSportId",
    "workoutType",
    "sportType",
    "subType",
    "sub_type",
    "type",
    "name",
    "sportName",
    "workoutName",
    "title"
  ];
  const parts = [];

  for (const field of fields) {
    const value = entry[field];
    if (isKnownSportId(value)) return value;
    const subtypeSportId = resolveSubtypeSportId(value);
    if (subtypeSportId) return subtypeSportId;
    collectText(value, parts);
  }

  const text = parts.join(" ");
  if (!text) return null;

  for (const sport of SPORTS) {
    if (text.indexOf(normalize(sport.id)) >= 0) return sport.id;
    if (text.indexOf(normalize(sport.name)) >= 0) return sport.id;
  }

  for (const hint of SPORT_HINTS) {
    for (const keyword of hint.keywords) {
      if (text.indexOf(keyword) >= 0) return hint.sportId;
    }
  }

  return null;
}

/**
 * Get the most recent workout duration in seconds.
 *
 * @returns {object} { durationSeconds: number, hasWorkout: boolean }
 *   durationSeconds: Duration of most recent workout, or 0 if unavailable
 *   hasWorkout: true if a workout was found
 */
export function getLastWorkoutDuration() {
  const summary = getLastWorkoutSummary();
  return {
    durationSeconds: summary.durationSeconds,
    hasWorkout: summary.hasWorkout
  };
}

/**
 * Get the most recent workout summary used for one-tap recovery routing.
 *
 * @returns {object}
 *   { durationSeconds, hasWorkout, sportId, startTime }
 */
export function getLastWorkoutSummary() {
  try {
    const history = workout.getHistory();
    if (!history || !Array.isArray(history) || history.length === 0) {
      return { durationSeconds: 0, hasWorkout: false, sportId: null, startTime: 0 };
    }

    // Find entry with largest startTime (API doesn't guarantee ordering)
    const best = findLatestWorkout(history);
    const duration = getDurationSeconds(best);
    return {
      durationSeconds: duration,
      hasWorkout: duration > 0,
      sportId: resolveWorkoutSportId(best),
      startTime: best.startTime || 0
    };
  } catch (e) {
    console.log(`Workout history error: ${e}`);
    return { durationSeconds: 0, hasWorkout: false, sportId: null, startTime: 0 };
  }
}

/**
 * Recommend routine type based on last workout duration.
 * @returns {"quick"|"full"}
 */
export function recommendFromWorkout() {
  const { durationSeconds, hasWorkout } = getLastWorkoutDuration();

  if (!hasWorkout || durationSeconds < 1800) {
    return "quick";
  }
  return "full";
}

export { getLastWorkoutDuration as getWorkoutDuration, recommendFromWorkout as recommendByWorkout };
