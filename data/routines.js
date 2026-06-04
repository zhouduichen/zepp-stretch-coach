/**
 * Stretching routine definitions.
 *
 * Each routine has:
 *   id: Unique routine ID
 *   sportId: Links to sport definition
 *   type: "quick" (<30 min) or "full" (>=30 min)
 *   phases: Array of phases, each with a list of exercise references
 *
 * Phase types:
 *   "warmup": Dynamic movements to prepare
 *   "main": Primary stretching block
 *   "cooldown": Final static holds
 *
 * Exercise entry:
 *   exerciseId: Reference to exercise definition
 *   duration: Override duration in seconds (optional, uses exercise default)
 *   side: "left", "right", or omitted = exercise default (usually "single")
 */

const ROUTINE_QUICK = "quick";
const ROUTINE_FULL = "full";

const PHASE_WARMUP = "warmup";
const PHASE_MAIN = "main";
const PHASE_COOLDOWN = "cooldown";

// ────────────────────────────────────────────
// Helper: build a routine definition object
// ────────────────────────────────────────────
function def(id, sportId, type, phases) {
  return { id, sportId, type, phases };
}

function withoutWallSupport(exercises) {
  return exercises.filter(entry => entry.exerciseId !== "calf-stretch");
}

// ────────────────────────────────────────────
// RUNNING (Outdoor + Indoor)
// ────────────────────────────────────────────
const runWarmupQuick = [
  { exerciseId: "side-lunge-stretch", duration: 20 },
  { exerciseId: "leg-swing", side: "left", duration: 15 },
  { exerciseId: "leg-swing", side: "right", duration: 15 },
  { exerciseId: "arm-circles", duration: 15 }
];

const runWarmupFull = [
  { exerciseId: "side-lunge-stretch", duration: 30 },
  { exerciseId: "leg-swing", side: "left", duration: 30 },
  { exerciseId: "leg-swing", side: "right", duration: 30 },
  { exerciseId: "side-leg-swing", side: "left", duration: 20 },
  { exerciseId: "side-leg-swing", side: "right", duration: 20 },
  { exerciseId: "walking-hamstring", side: "left", duration: 20 },
  { exerciseId: "walking-hamstring", side: "right", duration: 20 },
  { exerciseId: "arm-circles", duration: 20 }
];

const runMain = [
  { exerciseId: "standing-quad-stretch", side: "left" },
  { exerciseId: "standing-quad-stretch", side: "right" },
  { exerciseId: "standing-hamstring-stretch", side: "left" },
  { exerciseId: "standing-hamstring-stretch", side: "right" },
  { exerciseId: "calf-stretch", side: "left" },
  { exerciseId: "calf-stretch", side: "right" },
  { exerciseId: "hip-flexor-stretch", side: "left" },
  { exerciseId: "hip-flexor-stretch", side: "right" },
  { exerciseId: "glute-stretch", side: "left" },
  { exerciseId: "glute-stretch", side: "right" }
];

const runCooldownQuick = [
  { exerciseId: "neck-stretch", side: "left", duration: 10 },
  { exerciseId: "neck-stretch", side: "right", duration: 10 },
  { exerciseId: "shoulder-stretch", side: "left", duration: 15 },
  { exerciseId: "shoulder-stretch", side: "right", duration: 15 }
];

const runCooldownFull = [
  { exerciseId: "neck-stretch", side: "left" },
  { exerciseId: "neck-stretch", side: "right" },
  { exerciseId: "shoulder-stretch", side: "left" },
  { exerciseId: "shoulder-stretch", side: "right" },
  { exerciseId: "chest-stretch", duration: 30 }
];

// ────────────────────────────────────────────
// CYCLING (Outdoor + Indoor)
// ────────────────────────────────────────────
const cycleWarmupQuick = [
  { exerciseId: "side-lunge-stretch", duration: 20 },
  { exerciseId: "leg-swing", side: "left", duration: 15 },
  { exerciseId: "leg-swing", side: "right", duration: 15 },
  { exerciseId: "arm-circles", duration: 15 }
];

const cycleWarmupFull = [
  { exerciseId: "side-lunge-stretch", duration: 30 },
  { exerciseId: "leg-swing", side: "left", duration: 20 },
  { exerciseId: "leg-swing", side: "right", duration: 20 },
  { exerciseId: "hip-circles", side: "left", duration: 20 },
  { exerciseId: "hip-circles", side: "right", duration: 20 },
  { exerciseId: "torso-twist", duration: 20 },
  { exerciseId: "arm-circles", duration: 20 }
];

const cycleMain = [
  { exerciseId: "standing-quad-stretch-cycle", side: "left" },
  { exerciseId: "standing-quad-stretch-cycle", side: "right" },
  { exerciseId: "hamstring-stretch-cycle", side: "left" },
  { exerciseId: "hamstring-stretch-cycle", side: "right" },
  { exerciseId: "hip-flexor-stretch", side: "left" },
  { exerciseId: "hip-flexor-stretch", side: "right" },
  { exerciseId: "glute-stretch", side: "left" },
  { exerciseId: "glute-stretch", side: "right" },
  { exerciseId: "lower-back-twist", side: "left" },
  { exerciseId: "lower-back-twist", side: "right" }
];

const cycleCooldownQuick = [
  { exerciseId: "neck-stretch", side: "left", duration: 10 },
  { exerciseId: "neck-stretch", side: "right", duration: 10 },
  { exerciseId: "shoulder-stretch", side: "left", duration: 15 },
  { exerciseId: "shoulder-stretch", side: "right", duration: 15 }
];

const cycleCooldownFull = [
  { exerciseId: "neck-stretch", side: "left" },
  { exerciseId: "neck-stretch", side: "right" },
  { exerciseId: "shoulder-stretch", side: "left" },
  { exerciseId: "shoulder-stretch", side: "right" },
  { exerciseId: "chest-stretch", duration: 30 },
  { exerciseId: "lower-back-twist", side: "left", duration: 20 },
  { exerciseId: "lower-back-twist", side: "right", duration: 20 }
];

// ────────────────────────────────────────────
// STRENGTH UPPER BODY
// ────────────────────────────────────────────
const upperWarmupQuick = [
  { exerciseId: "arm-circles", duration: 20 },
  { exerciseId: "torso-twist", duration: 20 },
  { exerciseId: "neck-stretch", side: "left", duration: 10 },
  { exerciseId: "neck-stretch", side: "right", duration: 10 }
];

const upperWarmupFull = [
  { exerciseId: "arm-circles", duration: 30 },
  { exerciseId: "torso-twist", duration: 30 },
  { exerciseId: "cat-cow", duration: 20 },
  { exerciseId: "neck-stretch", side: "left", duration: 15 },
  { exerciseId: "neck-stretch", side: "right", duration: 15 },
  { exerciseId: "shoulder-stretch", side: "left", duration: 15 },
  { exerciseId: "shoulder-stretch", side: "right", duration: 15 }
];

const upperMain = [
  { exerciseId: "chest-stretch-upper", duration: 30 },
  { exerciseId: "triceps-stretch", side: "left" },
  { exerciseId: "triceps-stretch", side: "right" },
  { exerciseId: "lat-stretch", side: "left" },
  { exerciseId: "lat-stretch", side: "right" },
  { exerciseId: "bicep-stretch", duration: 30 },
  { exerciseId: "wrist-stretch", side: "left" },
  { exerciseId: "wrist-stretch", side: "right" },
  { exerciseId: "shoulder-stretch", side: "left" },
  { exerciseId: "shoulder-stretch", side: "right" }
];

const upperCooldownQuick = [
  { exerciseId: "neck-stretch", side: "left", duration: 10 },
  { exerciseId: "neck-stretch", side: "right", duration: 10 },
  { exerciseId: "cat-cow", duration: 15 }
];

const upperCooldownFull = [
  { exerciseId: "neck-stretch", side: "left" },
  { exerciseId: "neck-stretch", side: "right" },
  { exerciseId: "chest-stretch-upper", duration: 30 },
  { exerciseId: "cat-cow", duration: 20 }
];

// ────────────────────────────────────────────
// STRENGTH LOWER BODY
// ────────────────────────────────────────────
const lowerWarmupQuick = [
  { exerciseId: "leg-swing", side: "left", duration: 20 },
  { exerciseId: "leg-swing", side: "right", duration: 20 },
  { exerciseId: "side-leg-swing", side: "left", duration: 15 },
  { exerciseId: "side-leg-swing", side: "right", duration: 15 }
];

const lowerWarmupFull = [
  { exerciseId: "leg-swing", side: "left", duration: 30 },
  { exerciseId: "leg-swing", side: "right", duration: 30 },
  { exerciseId: "side-leg-swing", side: "left", duration: 20 },
  { exerciseId: "side-leg-swing", side: "right", duration: 20 },
  { exerciseId: "walking-hamstring", side: "left", duration: 20 },
  { exerciseId: "walking-hamstring", side: "right", duration: 20 },
  { exerciseId: "hip-circles", side: "left", duration: 20 },
  { exerciseId: "hip-circles", side: "right", duration: 20 }
];

const lowerMain = [
  { exerciseId: "standing-quad-stretch", side: "left" },
  { exerciseId: "standing-quad-stretch", side: "right" },
  { exerciseId: "standing-hamstring-stretch", side: "left" },
  { exerciseId: "standing-hamstring-stretch", side: "right" },
  { exerciseId: "calf-stretch", side: "left" },
  { exerciseId: "calf-stretch", side: "right" },
  { exerciseId: "hip-flexor-stretch", side: "left" },
  { exerciseId: "hip-flexor-stretch", side: "right" },
  { exerciseId: "glute-stretch", side: "left" },
  { exerciseId: "glute-stretch", side: "right" }
];

const lowerCooldownQuick = [
  { exerciseId: "neck-stretch", side: "left", duration: 10 },
  { exerciseId: "neck-stretch", side: "right", duration: 10 },
  { exerciseId: "lower-back-twist", side: "left", duration: 15 },
  { exerciseId: "lower-back-twist", side: "right", duration: 15 }
];

const lowerCooldownFull = [
  { exerciseId: "cat-cow", duration: 20 },
  { exerciseId: "lower-back-twist", side: "left" },
  { exerciseId: "lower-back-twist", side: "right" },
  { exerciseId: "neck-stretch", side: "left" },
  { exerciseId: "neck-stretch", side: "right" }
];

// ────────────────────────────────────────────
// BODYWEIGHT (Outdoor + Indoor)
// ────────────────────────────────────────────
const bodyweightWarmupQuick = [
  { exerciseId: "side-lunge-stretch", duration: 20 },
  { exerciseId: "leg-swing", side: "left", duration: 15 },
  { exerciseId: "leg-swing", side: "right", duration: 15 },
  { exerciseId: "arm-circles", duration: 15 }
];

const bodyweightWarmupFull = [
  { exerciseId: "side-lunge-stretch", duration: 30 },
  { exerciseId: "leg-swing", side: "left", duration: 20 },
  { exerciseId: "leg-swing", side: "right", duration: 20 },
  { exerciseId: "side-leg-swing", side: "left", duration: 20 },
  { exerciseId: "side-leg-swing", side: "right", duration: 20 },
  { exerciseId: "torso-twist", duration: 20 },
  { exerciseId: "arm-circles", duration: 20 }
];

const bodyweightMain = [
  { exerciseId: "standing-quad-stretch", side: "left" },
  { exerciseId: "standing-quad-stretch", side: "right" },
  { exerciseId: "standing-hamstring-stretch", side: "left" },
  { exerciseId: "standing-hamstring-stretch", side: "right" },
  { exerciseId: "calf-stretch", side: "left" },
  { exerciseId: "calf-stretch", side: "right" },
  { exerciseId: "hip-flexor-stretch", side: "left" },
  { exerciseId: "hip-flexor-stretch", side: "right" },
  { exerciseId: "shoulder-stretch", side: "left" },
  { exerciseId: "shoulder-stretch", side: "right" }
];

const bodyweightCooldownQuick = [
  { exerciseId: "neck-stretch", side: "left", duration: 10 },
  { exerciseId: "neck-stretch", side: "right", duration: 10 },
  { exerciseId: "chest-stretch", duration: 15 }
];

const bodyweightCooldownFull = [
  { exerciseId: "neck-stretch", side: "left" },
  { exerciseId: "neck-stretch", side: "right" },
  { exerciseId: "chest-stretch", duration: 30 },
  { exerciseId: "lower-back-twist", side: "left", duration: 20 },
  { exerciseId: "lower-back-twist", side: "right", duration: 20 }
];

// ────────────────────────────────────────────
// BALL SPORTS — common pattern
// ────────────────────────────────────────────
const ballWarmupQuick = [
  { exerciseId: "side-lunge-stretch", duration: 20 },
  { exerciseId: "leg-swing", side: "left", duration: 15 },
  { exerciseId: "leg-swing", side: "right", duration: 15 },
  { exerciseId: "arm-circles", duration: 15 },
  { exerciseId: "torso-twist", duration: 15 }
];

const ballWarmupFull = [
  { exerciseId: "side-lunge-stretch", duration: 30 },
  { exerciseId: "leg-swing", side: "left", duration: 20 },
  { exerciseId: "leg-swing", side: "right", duration: 20 },
  { exerciseId: "side-leg-swing", side: "left", duration: 20 },
  { exerciseId: "side-leg-swing", side: "right", duration: 20 },
  { exerciseId: "hip-circles", side: "left", duration: 20 },
  { exerciseId: "hip-circles", side: "right", duration: 20 },
  { exerciseId: "torso-twist", duration: 20 },
  { exerciseId: "arm-circles", duration: 20 },
  { exerciseId: "ankle-rotation", side: "left" },
  { exerciseId: "ankle-rotation", side: "right" }
];

const ballMain = [
  { exerciseId: "standing-hamstring-stretch", side: "left" },
  { exerciseId: "standing-hamstring-stretch", side: "right" },
  { exerciseId: "calf-stretch", side: "left" },
  { exerciseId: "calf-stretch", side: "right" },
  { exerciseId: "hip-flexor-stretch", side: "left" },
  { exerciseId: "hip-flexor-stretch", side: "right" },
  { exerciseId: "glute-stretch", side: "left" },
  { exerciseId: "glute-stretch", side: "right" },
  { exerciseId: "shoulder-stretch", side: "left" },
  { exerciseId: "shoulder-stretch", side: "right" },
  { exerciseId: "hamstring-ball", side: "left" },
  { exerciseId: "hamstring-ball", side: "right" }
];

const ballCooldownQuick = [
  { exerciseId: "neck-stretch", side: "left", duration: 10 },
  { exerciseId: "neck-stretch", side: "right", duration: 10 },
  { exerciseId: "chest-stretch", duration: 15 },
  { exerciseId: "torso-twist", duration: 15 }
];

const ballCooldownFull = [
  { exerciseId: "neck-stretch", side: "left" },
  { exerciseId: "neck-stretch", side: "right" },
  { exerciseId: "chest-stretch", duration: 30 },
  { exerciseId: "torso-twist", duration: 30 },
  { exerciseId: "lower-back-twist", side: "left" },
  { exerciseId: "lower-back-twist", side: "right" },
  { exerciseId: "groin-stretch", duration: 30 }
];

// ────────────────────────────────────────────
// Build the complete ROUTINES list
// ────────────────────────────────────────────

export const ROUTINES = [
  // RUNNING
  def("run-quick", "run-outdoor", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: runWarmupQuick },
    { type: PHASE_MAIN, exercises: withoutWallSupport(runMain) },
    { type: PHASE_COOLDOWN, exercises: runCooldownQuick }
  ]),
  def("run-full", "run-outdoor", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: runWarmupFull },
    { type: PHASE_MAIN, exercises: withoutWallSupport(runMain) },
    { type: PHASE_COOLDOWN, exercises: runCooldownFull }
  ]),
  def("run-indoor-quick", "run-indoor", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: runWarmupQuick },
    { type: PHASE_MAIN, exercises: runMain },
    { type: PHASE_COOLDOWN, exercises: runCooldownQuick }
  ]),
  def("run-indoor-full", "run-indoor", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: runWarmupFull },
    { type: PHASE_MAIN, exercises: runMain },
    { type: PHASE_COOLDOWN, exercises: runCooldownFull }
  ]),

  // CYCLING
  def("cycle-outdoor-quick", "cycle-outdoor", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: cycleWarmupQuick },
    { type: PHASE_MAIN, exercises: [
      { exerciseId: "standing-quad-stretch-cycle", side: "left" },
      { exerciseId: "standing-quad-stretch-cycle", side: "right" },
      { exerciseId: "standing-hamstring-stretch", side: "left" },
      { exerciseId: "standing-hamstring-stretch", side: "right" },
      { exerciseId: "hip-flexor-stretch", side: "left" },
      { exerciseId: "hip-flexor-stretch", side: "right" },
      { exerciseId: "glute-stretch", side: "left" },
      { exerciseId: "glute-stretch", side: "right" }
    ] },
    { type: PHASE_COOLDOWN, exercises: [
      { exerciseId: "neck-stretch", side: "left", duration: 10 },
      { exerciseId: "neck-stretch", side: "right", duration: 10 },
      { exerciseId: "shoulder-stretch", side: "left", duration: 15 },
      { exerciseId: "shoulder-stretch", side: "right", duration: 15 },
      { exerciseId: "chest-stretch", duration: 15 }
    ] }
  ]),
  def("cycle-outdoor-full", "cycle-outdoor", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: cycleWarmupFull },
    { type: PHASE_MAIN, exercises: [
      { exerciseId: "standing-quad-stretch-cycle", side: "left" },
      { exerciseId: "standing-quad-stretch-cycle", side: "right" },
      { exerciseId: "standing-hamstring-stretch", side: "left" },
      { exerciseId: "standing-hamstring-stretch", side: "right" },
      { exerciseId: "hip-flexor-stretch", side: "left" },
      { exerciseId: "hip-flexor-stretch", side: "right" },
      { exerciseId: "glute-stretch", side: "left" },
      { exerciseId: "glute-stretch", side: "right" },
      { exerciseId: "standing-hamstring-stretch", side: "left", duration: 20 },
      { exerciseId: "standing-hamstring-stretch", side: "right", duration: 20 }
    ] },
    { type: PHASE_COOLDOWN, exercises: [
      { exerciseId: "neck-stretch", side: "left" },
      { exerciseId: "neck-stretch", side: "right" },
      { exerciseId: "shoulder-stretch", side: "left" },
      { exerciseId: "shoulder-stretch", side: "right" },
      { exerciseId: "chest-stretch", duration: 30 },
      { exerciseId: "standing-hamstring-stretch", side: "left", duration: 20 },
      { exerciseId: "standing-hamstring-stretch", side: "right", duration: 20 }
    ] }
  ]),
  def("cycle-indoor-quick", "cycle-indoor", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: cycleWarmupQuick },
    { type: PHASE_MAIN, exercises: cycleMain },
    { type: PHASE_COOLDOWN, exercises: cycleCooldownQuick }
  ]),
  def("cycle-indoor-full", "cycle-indoor", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: cycleWarmupFull },
    { type: PHASE_MAIN, exercises: cycleMain },
    { type: PHASE_COOLDOWN, exercises: cycleCooldownFull }
  ]),

  // STRENGTH UPPER BODY
  def("strength-upper-quick", "strength-upper", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: upperWarmupQuick },
    { type: PHASE_MAIN, exercises: upperMain },
    { type: PHASE_COOLDOWN, exercises: upperCooldownQuick }
  ]),
  def("strength-upper-full", "strength-upper", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: upperWarmupFull },
    { type: PHASE_MAIN, exercises: upperMain },
    { type: PHASE_COOLDOWN, exercises: upperCooldownFull }
  ]),

  // STRENGTH LOWER BODY
  def("strength-lower-quick", "strength-lower", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: lowerWarmupQuick },
    { type: PHASE_MAIN, exercises: lowerMain },
    { type: PHASE_COOLDOWN, exercises: lowerCooldownQuick }
  ]),
  def("strength-lower-full", "strength-lower", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: lowerWarmupFull },
    { type: PHASE_MAIN, exercises: lowerMain },
    { type: PHASE_COOLDOWN, exercises: lowerCooldownFull }
  ]),

  // BODYWEIGHT
  def("bodyweight-outdoor-quick", "bodyweight-outdoor", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: bodyweightWarmupQuick },
    { type: PHASE_MAIN, exercises: withoutWallSupport(bodyweightMain) },
    { type: PHASE_COOLDOWN, exercises: bodyweightCooldownQuick }
  ]),
  def("bodyweight-outdoor-full", "bodyweight-outdoor", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: bodyweightWarmupFull },
    { type: PHASE_MAIN, exercises: withoutWallSupport(bodyweightMain) },
    { type: PHASE_COOLDOWN, exercises: [
      { exerciseId: "neck-stretch", side: "left" },
      { exerciseId: "neck-stretch", side: "right" },
      { exerciseId: "chest-stretch", duration: 30 },
      { exerciseId: "standing-hamstring-stretch", side: "left", duration: 20 },
      { exerciseId: "standing-hamstring-stretch", side: "right", duration: 20 }
    ] }
  ]),
  def("bodyweight-indoor-quick", "bodyweight-indoor", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: bodyweightWarmupQuick },
    { type: PHASE_MAIN, exercises: bodyweightMain },
    { type: PHASE_COOLDOWN, exercises: bodyweightCooldownQuick }
  ]),
  def("bodyweight-indoor-full", "bodyweight-indoor", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: bodyweightWarmupFull },
    { type: PHASE_MAIN, exercises: bodyweightMain },
    { type: PHASE_COOLDOWN, exercises: bodyweightCooldownFull }
  ]),

  // BALL SPORTS
  def("basketball-quick", "basketball", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: ballWarmupQuick },
    { type: PHASE_MAIN, exercises: withoutWallSupport(ballMain) },
    { type: PHASE_COOLDOWN, exercises: ballCooldownQuick }
  ]),
  def("basketball-full", "basketball", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: ballWarmupFull },
    { type: PHASE_MAIN, exercises: withoutWallSupport(ballMain) },
    { type: PHASE_COOLDOWN, exercises: ballCooldownQuick }
  ]),
  def("soccer-quick", "soccer", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: ballWarmupQuick },
    { type: PHASE_MAIN, exercises: withoutWallSupport(ballMain) },
    { type: PHASE_COOLDOWN, exercises: ballCooldownQuick }
  ]),
  def("soccer-full", "soccer", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: ballWarmupFull },
    { type: PHASE_MAIN, exercises: withoutWallSupport(ballMain) },
    { type: PHASE_COOLDOWN, exercises: ballCooldownQuick }
  ]),
  def("tennis-quick", "tennis", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: ballWarmupQuick },
    { type: PHASE_MAIN, exercises: withoutWallSupport(ballMain) },
    { type: PHASE_COOLDOWN, exercises: ballCooldownQuick }
  ]),
  def("tennis-full", "tennis", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: ballWarmupFull },
    { type: PHASE_MAIN, exercises: withoutWallSupport(ballMain) },
    { type: PHASE_COOLDOWN, exercises: ballCooldownQuick }
  ]),
  def("badminton-quick", "badminton", ROUTINE_QUICK, [
    { type: PHASE_WARMUP, exercises: ballWarmupQuick },
    { type: PHASE_MAIN, exercises: ballMain },
    { type: PHASE_COOLDOWN, exercises: ballCooldownQuick }
  ]),
  def("badminton-full", "badminton", ROUTINE_FULL, [
    { type: PHASE_WARMUP, exercises: ballWarmupFull },
    { type: PHASE_MAIN, exercises: ballMain },
    { type: PHASE_COOLDOWN, exercises: ballCooldownFull }
  ])
];

/**
 * Get a routine by ID.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getRoutine(id) {
  return ROUTINES.find(r => r.id === id);
}

/**
 * Get routines for a sport.
 * @param {string} sportId
 * @returns {object[]}
 */
export function getRoutinesBySport(sportId) {
  return ROUTINES.filter(r => r.sportId === sportId);
}

/**
 * Get recommended routine type based on workout duration.
 * @param {number} durationSeconds Workout duration
 * @returns {"quick"|"full"}
 */
export function recommendRoutineType(durationSeconds) {
  return durationSeconds < 1800 ? ROUTINE_QUICK : ROUTINE_FULL;
}

/**
 * Get the flat ordered list of all exercise steps in a routine.
 * Returns entries with resolved durations and side info.
 * @param {object} routine
 * @returns {object[]}
 */
export function flattenRoutine(routine) {
  const steps = [];
  for (const phase of routine.phases) {
    for (const entry of phase.exercises) {
      steps.push({
        phaseType: phase.type,
        exerciseId: entry.exerciseId,
        side: entry.side,
        duration: entry.duration || undefined
      });
    }
  }
  return steps;
}

export { ROUTINE_QUICK, ROUTINE_FULL, PHASE_WARMUP, PHASE_MAIN, PHASE_COOLDOWN };
