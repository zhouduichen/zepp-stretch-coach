/**
 * Validate UI and IMG_ANIM assets before building.
 */

import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../data/exercises.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = ["gt.r", "gt.s"];
const REQUIRED_UI = [
  "ask.png",
  "bg.png",
  "btn_back.png",
  "btn_end.png",
  "btn_home.png",
  "btn_next.png",
  "btn_ok.png",
  "btn_pause_red.png",
  "btn_prev.png",
  "btn_resume_green.png",
  "btn_safety.png",
  "btn_settings.png",
  "btn_skip.png",
  "btn_start.png",
  "icon.png",
  "icon_complete.png",
  "icon_stop.png",
  "cat_cardio.png",
  "cat_strength.png",
  "cat_ball.png",
  "sport_run.png",
  "sport_cycle.png",
  "sport_strength.png",
  "sport_bodyweight.png",
  "sport_basketball.png",
  "sport_soccer.png",
  "sport_tennis.png",
  "sport_badminton.png"
];

const animationFrames = new Map();
for (const exercise of EXERCISES) {
  const previous = animationFrames.get(exercise.animPrefix) || 0;
  animationFrames.set(exercise.animPrefix, Math.max(previous, exercise.animFrames));
}

const errors = [];
let checkedFrames = 0;

function requireFile(path) {
  if (!existsSync(path)) {
    errors.push(`Missing asset: ${path}`);
    return;
  }
  if (statSync(path).size === 0) errors.push(`Empty asset: ${path}`);
}

for (const target of TARGETS) {
  const assetRoot = join(ROOT, "assets", target);
  for (const file of REQUIRED_UI) requireFile(join(assetRoot, file));

  for (const [prefix, count] of animationFrames) {
    if (count < 4 || count > 8) {
      errors.push(`Animation "${prefix}" has invalid configured frame count: ${count}`);
    }

    for (let index = 0; index < count; index += 1) {
      requireFile(join(assetRoot, "animations", prefix, `f_${index}.png`));
      checkedFrames += 1;
    }
  }
}

if (errors.length) {
  console.error(`Asset validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Asset validation passed: ${REQUIRED_UI.length * TARGETS.length} UI assets and ${checkedFrames} animation frames.`);
