/**
 * Exercise categories used to organize stretching routines.
 * Each category groups related sports/activity types.
 */
export const CATEGORIES = [
  {
    id: "cardio",
    name: "Cardio / Endurance",
    icon: "cat_cardio",
    description: "Running, cycling, swimming recovery"
  },
  {
    id: "strength",
    name: "Strength Training",
    icon: "cat_strength",
    description: "Post lifting and bodyweight training"
  },
  {
    id: "ball",
    name: "Ball Sports",
    icon: "cat_ball",
    description: "Basketball, soccer, tennis recovery"
  }
];

/**
 * Get a category by ID.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getCategory(id) {
  return CATEGORIES.find(c => c.id === id);
}
