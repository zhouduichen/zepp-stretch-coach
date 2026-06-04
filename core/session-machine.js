/**
 * Session state machine for stretch workout sessions.
 *
 * States: PREPARE, ACTIVE, PAUSED, COMPLETE, ENDED
 *
 * Timing:
 * - Each exercise starts with a 3-second PREPARE countdown
 * - Static (single-side): 30s left, 30s right (adjustable via entry.duration)
 * - Static (both): runs once with default duration
 * - Dynamic: runs with default duration
 * - On skip: advances to next exercise
 * - On end: completes early, goes to COMPLETE then ENDED
 *
 * Timer uses Date.now() deadlines to prevent drift.
 */

const STATE_PREPARE = "PREPARE";
const STATE_ACTIVE = "ACTIVE";
const STATE_PAUSED = "PAUSED";
const STATE_COMPLETE = "COMPLETE";
const STATE_ENDED = "ENDED";

const DEFAULT_PREPARE_SECONDS = 3;
const SIDE_SWITCH_SECONDS = 3;

export class SessionMachine {
  constructor(steps, callbacks) {
    /**
     * steps: Array of { phaseType, exerciseId, side, duration }
     * callbacks: { onTick, onStateChange, onExerciseChange, onComplete }
     */
    this.steps = steps;
    this.callbacks = callbacks || {};

    this.state = STATE_PREPARE;
    this.currentStepIndex = 0;
    this.currentSide = null; // null, "left", "right", "both"
    this.substep = "prepare"; // "prepare", "active", "side-switch"

    this.deadline = 0;
    this.pausedRemaining = 0;
  }

  /**
   * Start the session from step 0.
   */
  start() {
    this._beginStep(0);
  }

  /**
   * Tick handler — called every ~1000ms by external timer.
   * Computes remaining time via Date.now() to avoid drift.
   */
  tick() {
    if (this.state !== STATE_PREPARE && this.state !== STATE_ACTIVE) {
      return;
    }

    if (this.substep === "prepare") {
      const remaining = Math.max(0, Math.ceil((this.deadline - Date.now()) / 1000));
      this._emitTick(remaining);

      if (remaining <= 0) {
        this._startActivePhase();
      }
      return;
    }

    // Active or side-switch
    const remaining = Math.max(0, Math.ceil((this.deadline - Date.now()) / 1000));
    this._emitTick(remaining);

    if (remaining <= 0) {
      this._advance();
    }
  }

  /**
   * Pause the session — saves remaining time.
   */
  pause() {
    if (this.state !== STATE_ACTIVE && this.state !== STATE_PREPARE) {
      return;
    }
    this.pausedRemaining = Math.max(0, Math.ceil((this.deadline - Date.now()) / 1000));
    this._setState(STATE_PAUSED);
  }

  /**
   * Resume the session — restores deadline from saved remaining.
   */
  resume() {
    if (this.state !== STATE_PAUSED) {
      return;
    }
    this.deadline = Date.now() + this.pausedRemaining * 1000;
    this.pausedRemaining = 0;
    this._setState(this.substep === "prepare" ? STATE_PREPARE : STATE_ACTIVE);
  }

  /**
   * Skip the current exercise and advance to the next.
   */
  skip() {
    if (this.state !== STATE_ACTIVE && this.state !== STATE_PREPARE && this.state !== STATE_PAUSED) {
      return;
    }
    this.pausedRemaining = 0;
    this._beginNextStep();
  }

  /**
   * End the session early — goes to COMPLETE then ENDED.
   */
  end() {
    if (this.state === STATE_ENDED || this.state === STATE_COMPLETE) {
      return;
    }
    this._setState(STATE_COMPLETE);
    if (this.callbacks.onComplete) {
      this.callbacks.onComplete({ completed: false, reason: "early_end" });
    }
    this._setState(STATE_ENDED);
  }

  /**
   * Get current exercise context.
   */
  getContext() {
    const step = this.steps[this.currentStepIndex];
    if (!step) return null;

    return {
      state: this.state,
      stepIndex: this.currentStepIndex,
      totalSteps: this.steps.length,
      exerciseId: step.exerciseId,
      side: this.currentSide,
      phaseType: step.phaseType,
      substep: this.substep,
      remaining: Math.max(0, Math.ceil((this.deadline - Date.now()) / 1000))
    };
  }

  /**
   * Get total remaining time across all remaining steps.
   * Useful for display, not guaranteed exact due to pauses.
   */
  getTotalRemaining() {
    let total = 0;
    const now = Date.now();

    for (let i = this.currentStepIndex; i < this.steps.length; i++) {
      const step = this.steps[i];

      if (i === this.currentStepIndex) {
        // Current step — use actual remaining
        total += this.state === STATE_PAUSED
          ? this.pausedRemaining
          : Math.max(0, Math.ceil((this.deadline - now) / 1000));

        if (step.side === "single" && this.currentSide === "left" && this.substep === "active") {
          total += SIDE_SWITCH_SECONDS + this._getStepDuration(step);
        } else if (this.substep === "side-switch") {
          total += this._getStepDuration(step);
        }
      } else {
        // Future step — estimate
        const dur = this._getStepDuration(step);
        if (step.side === "single") {
          total += DEFAULT_PREPARE_SECONDS + dur + SIDE_SWITCH_SECONDS + dur;
        } else {
          total += DEFAULT_PREPARE_SECONDS + dur;
        }
      }
    }

    return total;
  }

  // ── Private ──

  _beginStep(index) {
    this.currentStepIndex = index;
    this.currentSide = null;
    this.substep = "prepare";
    this._startPrepare();
  }

  _startPrepare() {
    this.substep = "prepare";
    this.deadline = Date.now() + DEFAULT_PREPARE_SECONDS * 1000;
    this._setState(STATE_PREPARE);

    if (this.callbacks.onExerciseChange) {
      const step = this.steps[this.currentStepIndex];
      this.callbacks.onExerciseChange({
        exerciseId: step.exerciseId,
        phaseType: step.phaseType,
        action: "prepare"
      });
    }
  }

  _startActivePhase() {
    const step = this.steps[this.currentStepIndex];
    const sides = this._getSides(step);
    this.currentSide = sides[0];
    this.substep = "active";
    this.deadline = Date.now() + this._getStepDuration(step) * 1000;
    this._setState(STATE_ACTIVE);

    if (this.callbacks.onExerciseChange) {
      this.callbacks.onExerciseChange({
        exerciseId: step.exerciseId,
        phaseType: step.phaseType,
        side: this.currentSide,
        action: "start"
      });
    }
  }

  _advance() {
    const step = this.steps[this.currentStepIndex];

    // Start the second side after the switch countdown.
    if (this.substep === "side-switch") {
      this.substep = "active";
      this.deadline = Date.now() + this._getStepDuration(step) * 1000;
      this._setState(STATE_ACTIVE);

      if (this.callbacks.onExerciseChange) {
        this.callbacks.onExerciseChange({
          exerciseId: step.exerciseId,
          phaseType: step.phaseType,
          side: "right",
          action: "side_start"
        });
      }
      return;
    }

    // If single-side and on left side, switch to right
    if (this.currentSide === "left" && this._hasTwoSides(step)) {
      this.currentSide = "right";
      this.substep = "side-switch";
      this.deadline = Date.now() + SIDE_SWITCH_SECONDS * 1000;
      this._setState(STATE_ACTIVE);

      if (this.callbacks.onExerciseChange) {
        this.callbacks.onExerciseChange({
          exerciseId: step.exerciseId,
          phaseType: step.phaseType,
          side: "right",
          action: "side_switch"
        });
      }
      return;
    }

    this._beginNextStep();
  }

  _beginNextStep() {
    const nextIndex = this.currentStepIndex + 1;
    if (nextIndex >= this.steps.length) {
      // Session complete
      this._setState(STATE_COMPLETE);
      if (this.callbacks.onComplete) {
        this.callbacks.onComplete({ completed: true, reason: "all_done" });
      }
      this._setState(STATE_ENDED);
      return;
    }

    this._beginStep(nextIndex);
  }

  _getStepDuration(step) {
    return step.duration || 30;
  }

  _getSides(step) {
    const exSide = step.side || "both";
    if (exSide === "left") return ["left"];
    if (exSide === "right") return ["right"];
    if (exSide === "single") return ["left", "right"];
    return ["both"];
  }

  _hasTwoSides(step) {
    const exSide = step.side || "both";
    return exSide === "single";
  }

  _setState(newState) {
    const oldState = this.state;
    this.state = newState;
    if (this.callbacks.onStateChange) {
      this.callbacks.onStateChange(oldState, newState);
    }
  }

  _emitTick(remaining) {
    if (this.callbacks.onTick) {
      this.callbacks.onTick(remaining, this.getContext());
    }
  }

  destroy() {
    // Timer managed externally by session.js
  }
}

export {
  STATE_PREPARE, STATE_ACTIVE, STATE_PAUSED, STATE_COMPLETE, STATE_ENDED,
  DEFAULT_PREPARE_SECONDS, SIDE_SWITCH_SECONDS
};
