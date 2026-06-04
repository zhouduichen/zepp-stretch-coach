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

const workout = new Workout();

/**
 * Get the most recent workout duration in seconds.
 *
 * @returns {object} { durationSeconds: number, hasWorkout: boolean }
 *   durationSeconds: Duration of most recent workout, or 0 if unavailable
 *   hasWorkout: true if a workout was found
 */
export function getLastWorkoutDuration() {
  try {
    const history = workout.getHistory();
    if (!history || !Array.isArray(history) || history.length === 0) {
      return { durationSeconds: 0, hasWorkout: false };
    }

    // Find entry with largest startTime (API doesn't guarantee ordering)
    let best = history[0];
    for (let i = 1; i < history.length; i++) {
      if ((history[i].startTime || 0) > (best.startTime || 0)) {
        best = history[i];
      }
    }

    const duration = best.duration || 0;
    return { durationSeconds: duration, hasWorkout: duration > 0 };
  } catch (e) {
    console.log(`Workout history error: ${e}`);
    return { durationSeconds: 0, hasWorkout: false };
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
