/**
 * App-level vibration patterns backed by Zepp OS API Level 3.0 scenes.
 *
 * Modes:
 *   standard: Exercise start, interval, countdown, side switch and completion.
 *   switch:   Side switch and completion only.
 *   off:      No vibration.
 */

import {
  Vibrator,
  VIBRATOR_SCENE_SHORT_LIGHT,
  VIBRATOR_SCENE_SHORT_MIDDLE,
  VIBRATOR_SCENE_DURATION,
  VIBRATOR_SCENE_STRONG_REMINDER,
  VIBRATOR_SCENE_NOTIFICATION
} from "@zos/sensor";

const vibrator = new Vibrator();

const MODE_STANDARD = "standard";
const MODE_SWITCH_ONLY = "switch";
const MODE_OFF = "off";

let currentMode = MODE_STANDARD;

function setMode(mode) {
  currentMode = [MODE_STANDARD, MODE_SWITCH_ONLY, MODE_OFF].includes(mode)
    ? mode
    : MODE_STANDARD;
}

function clearAll() {
  try {
    vibrator.stop();
  } catch (e) {
    console.log(`Vibration stop error: ${e}`);
  }
}

function _start(mode) {
  try {
    vibrator.start({ mode });
  } catch (e) {
    console.log(`Vibration start error: ${e}`);
  }
}

function exerciseStart() {
  if (currentMode !== MODE_STANDARD) return;
  _start(VIBRATOR_SCENE_DURATION);
}

function intervalTick() {
  if (currentMode !== MODE_STANDARD) return;
  _start(VIBRATOR_SCENE_SHORT_LIGHT);
}

function finalCountdown() {
  if (currentMode !== MODE_STANDARD) return;
  _start(VIBRATOR_SCENE_SHORT_MIDDLE);
}

function sideSwitch() {
  if (currentMode === MODE_OFF) return;
  _start(VIBRATOR_SCENE_NOTIFICATION);
}

function complete() {
  if (currentMode === MODE_OFF) return;
  _start(VIBRATOR_SCENE_STRONG_REMINDER);
}

function warning() {
  if (currentMode === MODE_OFF) return;
  _start(VIBRATOR_SCENE_STRONG_REMINDER);
}

export const Vibration = {
  setMode,
  clearAll,
  exerciseStart,
  intervalTick,
  finalCountdown,
  sideSwitch,
  complete,
  warning,
  MODE_STANDARD,
  MODE_SWITCH_ONLY,
  MODE_OFF
};

export { MODE_STANDARD, MODE_SWITCH_ONLY, MODE_OFF };
