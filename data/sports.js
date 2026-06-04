/**
 * Sport definitions for stretching routines.
 * 12 scenarios: 4 cardio, 4 strength, 4 ball sports.
 * Each sport has indoor/outdoor variants and quick/full recovery modes.
 */
export const SPORTS = [
  // ── CARDIO / ENDURANCE ──
  {
    id: "run-outdoor",
    categoryId: "cardio",
    name: "Running (Outdoor)",
    shortName: "Outdoor Run",
    icon: "sport_run",
    environment: "outdoor",
    supportRequired: false,
    intensity: "high",
    typicalDuration: 1800,
    allowsQuick: true
  },
  {
    id: "run-indoor",
    categoryId: "cardio",
    name: "Running (Indoor/Treadmill)",
    shortName: "Treadmill Run",
    icon: "sport_run",
    environment: "indoor",
    supportRequired: false,
    intensity: "high",
    typicalDuration: 1800,
    allowsQuick: true
  },
  {
    id: "cycle-outdoor",
    categoryId: "cardio",
    name: "Cycling (Outdoor)",
    shortName: "Outdoor Cycling",
    icon: "sport_cycle",
    environment: "outdoor",
    supportRequired: false,
    intensity: "high",
    typicalDuration: 2700,
    allowsQuick: true
  },
  {
    id: "cycle-indoor",
    categoryId: "cardio",
    name: "Cycling (Indoor/Spin)",
    shortName: "Indoor Cycling",
    icon: "sport_cycle",
    environment: "indoor",
    supportRequired: false,
    intensity: "high",
    typicalDuration: 2700,
    allowsQuick: true
  },

  // ── STRENGTH TRAINING ──
  {
    id: "strength-upper",
    categoryId: "strength",
    name: "Upper Body Training",
    shortName: "Upper Body",
    icon: "sport_strength",
    environment: "indoor",
    supportRequired: false,
    intensity: "high",
    typicalDuration: 2400,
    allowsQuick: true
  },
  {
    id: "strength-lower",
    categoryId: "strength",
    name: "Lower Body Training",
    shortName: "Lower Body",
    icon: "sport_strength",
    environment: "indoor",
    supportRequired: false,
    intensity: "high",
    typicalDuration: 2400,
    allowsQuick: true
  },
  {
    id: "bodyweight-outdoor",
    categoryId: "strength",
    name: "Bodyweight (Outdoor)",
    shortName: "Outdoor Bodyweight",
    icon: "sport_bodyweight",
    environment: "outdoor",
    supportRequired: false,
    intensity: "medium",
    typicalDuration: 1800,
    allowsQuick: true
  },
  {
    id: "bodyweight-indoor",
    categoryId: "strength",
    name: "Bodyweight (Indoor/Gym)",
    shortName: "Indoor Bodyweight",
    icon: "sport_bodyweight",
    environment: "indoor",
    supportRequired: false,
    intensity: "medium",
    typicalDuration: 1800,
    allowsQuick: true
  },

  // ── BALL SPORTS ──
  {
    id: "basketball",
    categoryId: "ball",
    name: "Basketball",
    shortName: "Basketball",
    icon: "sport_basketball",
    environment: "outdoor",
    supportRequired: false,
    intensity: "high",
    typicalDuration: 3600,
    allowsQuick: true
  },
  {
    id: "soccer",
    categoryId: "ball",
    name: "Soccer / Football",
    shortName: "Soccer",
    icon: "sport_soccer",
    environment: "outdoor",
    supportRequired: false,
    intensity: "high",
    typicalDuration: 3600,
    allowsQuick: true
  },
  {
    id: "tennis",
    categoryId: "ball",
    name: "Tennis",
    shortName: "Tennis",
    icon: "sport_tennis",
    environment: "outdoor",
    supportRequired: false,
    intensity: "high",
    typicalDuration: 2700,
    allowsQuick: true
  },
  {
    id: "badminton",
    categoryId: "ball",
    name: "Badminton",
    shortName: "Badminton",
    icon: "sport_badminton",
    environment: "indoor",
    supportRequired: false,
    intensity: "medium",
    typicalDuration: 2400,
    allowsQuick: true
  }
];

/**
 * Get a sport by ID.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getSport(id) {
  return SPORTS.find(s => s.id === id);
}

/**
 * Filter sports by category.
 * @param {string} categoryId
 * @returns {object[]}
 */
export function getSportsByCategory(categoryId) {
  return SPORTS.filter(s => s.categoryId === categoryId);
}
