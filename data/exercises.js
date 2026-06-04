/**
 * Exercise definitions for all stretching movements.
 *
 * Each exercise has:
 *   id: Unique identifier
 *   name: Display name
 *   type: "static" (hold position) or "dynamic" (movement-based)
 *   sides: "single" (left+right separately) or "both" (both sides together)
 *   defaultDuration: seconds per rep/side (static) or total (dynamic)
 *   targetMuscles: Array of muscle group IDs
 *   supportRequired: Whether this exercise needs a wall/chair/floor
 *   environment: "indoor", "outdoor", or "any"
 *   sourceIds: Public sources used to assemble this product content
 *   reviewStatus: Professional-review status for this app's adaptation
 *   animPrefix: Animation file prefix in assets
 *   animFrames: Number of animation frames
 *   animFps: Animation frame rate
 *   contraindications: Conditions where this exercise should be avoided
 */

const SOURCE_AHA = "aha-flexibility";
const SOURCE_NHS = "nhs-post-exercise";
const SOURCE_AAOS = "aaos-cooldown";

export const EXERCISES = [
  // 鈺愨晲鈺?RUNNING 鈺愨晲鈺?  {
  {
    id: "standing-quad-stretch",
    name: "Standing Quad Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["quads", "hip-flexors"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "quad",
    animFrames: 8,
    animFps: 3
  },
  {
    id: "standing-hamstring-stretch",
    name: "Standing Hamstring Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["hamstrings", "lower-back"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "hamstring",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "calf-stretch",
    name: "Calf Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["calves"],
    supportRequired: true,
    environment: "indoor",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "calf",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "hip-flexor-stretch",
    name: "Hip Flexor Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["hip-flexors", "quads"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "hipflexor",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "glute-stretch",
    name: "Glute Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["glutes"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "glute",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "side-lunge-stretch",
    name: "Side Lunge Stretch",
    type: "dynamic",
    sides: "both",
    defaultDuration: 30,
    targetMuscles: ["adductors", "groin"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "sidelunge",
    animFrames: 6,
    animFps: 3
  },

  // 鈺愨晲鈺?CYCLING 鈺愨晲鈺?  {
  {
    id: "standing-quad-stretch-cycle",
    name: "Standing Quad Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["quads", "hip-flexors"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "quad",
    animFrames: 8,
    animFps: 3
  },
  {
    id: "hamstring-stretch-cycle",
    name: "Seated Hamstring Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["hamstrings", "lower-back"],
    supportRequired: true,
    environment: "indoor",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "seated_hamstring",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "lower-back-twist",
    name: "Seated Lower Back Twist",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["lower-back", "obliques"],
    supportRequired: true,
    environment: "indoor",
    sourceIds: [SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "backtwist",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "shoulder-stretch",
    name: "Cross-Body Shoulder Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["shoulders", "upper-back"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "shoulder",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "chest-stretch",
    name: "Standing Chest Opener",
    type: "static",
    sides: "both",
    defaultDuration: 30,
    targetMuscles: ["chest", "shoulders"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "chest",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "neck-stretch",
    name: "Neck Release",
    type: "static",
    sides: "single",
    defaultDuration: 15,
    targetMuscles: ["neck", "upper-traps"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "neck",
    animFrames: 4,
    animFps: 3
  },

  // 鈺愨晲鈺?STRENGTH / UPPER BODY 鈺愨晲鈺?  {
  {
    id: "chest-stretch-upper",
    name: "Chest Stretch",
    type: "static",
    sides: "both",
    defaultDuration: 30,
    targetMuscles: ["chest", "shoulders"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "chest",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "triceps-stretch",
    name: "Triceps Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["triceps", "shoulders"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "triceps",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "lat-stretch",
    name: "Lat Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["lats", "upper-back"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "lat",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "bicep-stretch",
    name: "Bicep Stretch",
    type: "static",
    sides: "both",
    defaultDuration: 30,
    targetMuscles: ["biceps", "chest"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "bicep",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "wrist-stretch",
    name: "Wrist Flexor Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 20,
    targetMuscles: ["wrists", "forearms"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "wrist",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "cat-cow",
    name: "Cat-Cow Stretch",
    type: "dynamic",
    sides: "both",
    defaultDuration: 30,
    targetMuscles: ["lower-back", "upper-back", "core"],
    supportRequired: true,
    environment: "indoor",
    sourceIds: [SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "catcow",
    animFrames: 6,
    animFps: 3
  },

  // 鈺愨晲鈺?LOWER BODY 鈺愨晲鈺?  {
  {
    id: "leg-swing",
    name: "Forward Leg Swing",
    type: "dynamic",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["hamstrings", "quads", "hip-flexors"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "legswing",
    animFrames: 6,
    animFps: 4
  },
  {
    id: "side-leg-swing",
    name: "Side Leg Swing",
    type: "dynamic",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["adductors", "abductors", "glutes"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "sidelegswing",
    animFrames: 6,
    animFps: 4
  },
  {
    id: "walking-hamstring",
    name: "Walking Hamstring Stretch",
    type: "dynamic",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["hamstrings", "lower-back"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "walking_hamstring",
    animFrames: 6,
    animFps: 3
  },

  // 鈺愨晲鈺?BALL SPORTS 鈺愨晲鈺?  {
  {
    id: "hip-circles",
    name: "Hip Circles",
    type: "dynamic",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["hip-flexors", "glutes", "lower-back"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "hipcircle",
    animFrames: 6,
    animFps: 4
  },
  {
    id: "torso-twist",
    name: "Torso Twist",
    type: "dynamic",
    sides: "both",
    defaultDuration: 30,
    targetMuscles: ["obliques", "lower-back", "core"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "torsotwist",
    animFrames: 6,
    animFps: 4
  },
  {
    id: "arm-circles",
    name: "Arm Circles",
    type: "dynamic",
    sides: "both",
    defaultDuration: 30,
    targetMuscles: ["shoulders", "upper-back"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "armcircle",
    animFrames: 6,
    animFps: 4
  },
  {
    id: "ankle-rotation",
    name: "Ankle Rotations",
    type: "dynamic",
    sides: "single",
    defaultDuration: 20,
    targetMuscles: ["ankles", "calves"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "ankle",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "hamstring-ball",
    name: "Standing Hamstring Stretch",
    type: "static",
    sides: "single",
    defaultDuration: 30,
    targetMuscles: ["hamstrings", "lower-back"],
    supportRequired: false,
    environment: "any",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "hamstring",
    animFrames: 4,
    animFps: 3
  },
  {
    id: "groin-stretch",
    name: "Groin Stretch",
    type: "static",
    sides: "both",
    defaultDuration: 30,
    targetMuscles: ["adductors", "groin"],
    supportRequired: true,
    environment: "indoor",
    sourceIds: [SOURCE_AHA, SOURCE_NHS, SOURCE_AAOS],
    reviewStatus: "pending-professional-review",
    animPrefix: "groin",
    animFrames: 4,
    animFps: 3
  }
];

/**
 * Get an exercise by ID.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getExercise(id) {
  return EXERCISES.find(e => e.id === id);
}

/**
 * Validate exercise references. Returns array of missing exercise IDs.
 * @param {string[]} exerciseIds
 * @returns {string[]}
 */
export function validateExerciseRefs(exerciseIds) {
  return exerciseIds.filter(id => !getExercise(id));
}
