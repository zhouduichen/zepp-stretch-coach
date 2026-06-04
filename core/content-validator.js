/**
 * Content validation logic for exercise/routine configuration.
 * Run during development to catch errors before building.
 */

import { EXERCISES } from "../data/exercises.js";
import { ROUTINES, flattenRoutine } from "../data/routines.js";
import { SPORTS } from "../data/sports.js";
import { CATEGORIES } from "../data/categories.js";
import { SOURCES } from "../data/sources.js";

/**
 * Validate all content configuration.
 * Returns array of error messages. Empty array = clean.
 */
export function validateAll() {
  const errors = [];

  // 1. Check for duplicate IDs
  errors.push(...checkDuplicateIds());

  // 2. Check exercise references in routines
  errors.push(...checkExerciseRefs());

  // 3. Check outdoor routines don't use support-required exercises
  errors.push(...checkOutdoorSupport());

  // 4. Check source references
  errors.push(...checkSourceRefs());

  // 5. Check for anomalous durations
  errors.push(...checkAnomalousDurations());

  // 6. Check sport-category references
  errors.push(...checkCategoryRefs());

  return errors;
}

function checkDuplicateIds() {
  const errors = [];
  const seen = {};

  const allItems = [
    ...CATEGORIES.map(c => ["category", c.id]),
    ...SPORTS.map(s => ["sport", s.id]),
    ...EXERCISES.map(e => ["exercise", e.id]),
    ...ROUTINES.map(r => ["routine", r.id]),
    ...Object.values(SOURCES).map(s => ["source", s.id])
  ];

  for (const [type, id] of allItems) {
    if (seen[id]) {
      errors.push(`Duplicate ID "${id}" in ${type} (also in ${seen[id]})`);
    }
    seen[id] = type;
  }

  return errors;
}

function checkExerciseRefs() {
  const errors = [];
  const validIds = new Set(EXERCISES.map(e => e.id));

  for (const routine of ROUTINES) {
    const steps = flattenRoutine(routine);
    for (const step of steps) {
      if (!validIds.has(step.exerciseId)) {
        errors.push(`Routine "${routine.id}" references unknown exercise "${step.exerciseId}"`);
      }
    }
  }

  return errors;
}

function checkOutdoorSupport() {
  const errors = [];
  const validIds = new Set(EXERCISES.map(e => e.id));

  for (const sport of SPORTS) {
    if (sport.environment !== "outdoor") continue;

    const routines = ROUTINES.filter(r => r.sportId === sport.id);
    for (const routine of routines) {
      const steps = flattenRoutine(routine);
      for (const step of steps) {
        const ex = EXERCISES.find(e => e.id === step.exerciseId);
        if (ex && ex.supportRequired) {
          errors.push(`Routine "${routine.id}" (outdoor sport "${sport.id}") uses support-required exercise "${step.exerciseId}"`);
        }
      }
    }
  }

  return errors;
}

function checkSourceRefs() {
  const errors = [];
  const validSourceIds = new Set(Object.values(SOURCES).map(s => s.id));

  for (const ex of EXERCISES) {
    for (const sid of ex.sourceIds) {
      if (!validSourceIds.has(sid)) {
        errors.push(`Exercise "${ex.id}" references unknown source "${sid}"`);
      }
    }
  }

  return errors;
}

function checkAnomalousDurations() {
  const errors = [];

  for (const ex of EXERCISES) {
    if (ex.defaultDuration < 5) {
      errors.push(`Exercise "${ex.id}" has unusually short duration: ${ex.defaultDuration}s`);
    }
    if (ex.defaultDuration > 120) {
      errors.push(`Exercise "${ex.id}" has unusually long duration: ${ex.defaultDuration}s`);
    }
  }

  for (const routine of ROUTINES) {
    for (const phase of routine.phases) {
      for (const entry of phase.exercises) {
        if (entry.duration && entry.duration < 5) {
          errors.push(`Routine "${routine.id}" has unusually short entry duration: ${entry.duration}s for "${entry.exerciseId}"`);
        }
      }
    }
  }

  return errors;
}

function checkCategoryRefs() {
  const errors = [];
  const validCategoryIds = new Set(CATEGORIES.map(c => c.id));

  for (const sport of SPORTS) {
    if (!validCategoryIds.has(sport.categoryId)) {
      errors.push(`Sport "${sport.id}" references unknown category "${sport.categoryId}"`);
    }
  }

  return errors;
}
