/**
 * Workout recommendation engine.
 *
 * Given a sport selection and optional workout duration,
 * recommends the appropriate stretching routine.
 */

import { getRoutinesBySport, recommendRoutineType, flattenRoutine } from "../data/routines.js";
import { getSport } from "../data/sports.js";
import { getExercise } from "../data/exercises.js";

export const DEFAULT_RECOVERY_SPORT_ID = "run-outdoor";

/**
 * Recommend a routine for the given sport and workout duration.
 *
 * @param {string} sportId
 * @param {number} [workoutDurationSeconds] Optional workout duration for smart recommendation
 * @param {object} [options]
 * @param {string} [options.routineType] Override: "quick" or "full"
 * @returns {object|null} { routine, steps } or null if no routine found
 */
export function recommendRoutine(sportId, workoutDurationSeconds, options) {
  const sport = getSport(sportId);
  if (!sport) return null;

  const routines = getRoutinesBySport(sportId);
  if (routines.length === 0) return null;

  let type;
  if (options && options.routineType) {
    type = options.routineType;
  } else if (workoutDurationSeconds !== undefined) {
    type = recommendRoutineType(workoutDurationSeconds);
  } else {
    // Default to quick
    type = "quick";
  }

  const routine = routines.find(r => r.type === type);
  if (!routine) return null;

  const steps = flattenRoutine(routine);

  // Resolve durations from exercise definitions
  const resolvedSteps = steps.map(step => {
    const ex = getExercise(step.exerciseId);
    return {
      ...step,
      side: step.side || (ex ? ex.sides : "both"),
      duration: step.duration || (ex ? ex.defaultDuration : 30)
    };
  });

  return { routine, steps: resolvedSteps };
}

/**
 * Get available routine types for a sport.
 * @param {string} sportId
 * @returns {string[]}
 */
export function getAvailableTypes(sportId) {
  const routines = getRoutinesBySport(sportId);
  return routines.map(r => r.type);
}

/**
 * Estimate session duration in seconds for a given set of steps.
 * @param {object[]} steps
 * @returns {number}
 */
export function estimateDuration(steps) {
  let total = 0;
  for (const step of steps) {
    const dur = step.duration || 30;
    const ex = getExercise(step.exerciseId);
    total += 3; // prepare
    if (step.side === "single") {
      total += dur + 3 + dur; // left + switch + right
    } else {
      total += dur;
    }
  }
  return total;
}

/**
 * Build the one-tap recommendation shown from recent workout context.
 *
 * The workout history API reliably gives us recency and duration. If a sport
 * can be resolved from the record, use it; otherwise keep the routine one tap
 * away by falling back to the app's last selected sport or outdoor running.
 *
 * @param {object|null} recentWorkout
 * @param {string} [fallbackSportId]
 * @returns {object|null}
 */
export function recommendFromRecentWorkout(recentWorkout, fallbackSportId = DEFAULT_RECOVERY_SPORT_ID) {
  const hasWorkout = !!(recentWorkout && recentWorkout.hasWorkout);
  const recordSportId = recentWorkout && recentWorkout.sportId;
  const hasRecordSport = !!getSport(recordSportId);
  const fallbackSport = getSport(fallbackSportId) ? fallbackSportId : DEFAULT_RECOVERY_SPORT_ID;
  const sportId = hasRecordSport ? recordSportId : fallbackSport;
  const durationSeconds = hasWorkout ? Math.max(0, recentWorkout.durationSeconds || 0) : undefined;
  const routineType = durationSeconds !== undefined ? recommendRoutineType(durationSeconds) : "quick";
  const result = recommendRoutine(sportId, undefined, { routineType });

  if (!result) return null;

  const estimatedSeconds = estimateDuration(result.steps);
  return {
    sportId,
    sport: getSport(sportId),
    routineType,
    routine: result.routine,
    steps: result.steps,
    durationSeconds: durationSeconds || 0,
    estimatedSeconds,
    durationMinutes: estimatedSeconds > 0 ? Math.ceil(estimatedSeconds / 60) : 0,
    hasWorkout,
    source: hasRecordSport ? "last-workout" : "fallback"
  };
}
