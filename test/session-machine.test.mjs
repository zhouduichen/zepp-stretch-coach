/**
 * Tests for the session state machine.
 * Run with: node --test test/*.test.mjs
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { SessionMachine, STATE_PREPARE, STATE_ACTIVE, STATE_PAUSED, STATE_COMPLETE, STATE_ENDED } from "../core/session-machine.js";

/**
 * Create a simple two-step routine for testing.
 * Step 1: single-side static (30s each side)
 * Step 2: both-side dynamic (30s)
 */
function makeTestSteps() {
  return [
    { phaseType: "main", exerciseId: "standing-quad-stretch", side: "single", duration: 30 },
    { phaseType: "main", exerciseId: "arm-circles", side: "both", duration: 30 }
  ];
}

/**
 * Collect callbacks into an array for assertion.
 */
function collectCallbacks() {
  const events = [];
  return {
    events,
    callbacks: {
      onStateChange: (oldState, newState) => {
        events.push({ type: "stateChange", oldState, newState });
      },
      onExerciseChange: (info) => {
        events.push({ type: "exerciseChange", ...info });
      },
      onTick: (remaining, ctx) => {
        events.push({ type: "tick", remaining });
      },
      onComplete: (result) => {
        events.push({ type: "complete", ...result });
      }
    }
  };
}

describe("SessionMachine", () => {
  describe("start and initial state", () => {
    it("should start in PREPARE state", () => {
      const steps = makeTestSteps();
      const machine = new SessionMachine(steps);
      machine.start();
      assert.strictEqual(machine.state, STATE_PREPARE);
      assert.strictEqual(machine.currentStepIndex, 0);
      assert.strictEqual(machine.substep, "prepare");
    });

    it("should emit exerciseChange on start", () => {
      const steps = makeTestSteps();
      const { events, callbacks } = collectCallbacks();
      const machine = new SessionMachine(steps, callbacks);
      machine.start();
      assert.strictEqual(events.length, 2); // stateChange + exerciseChange
      assert.strictEqual(events[1].type, "exerciseChange");
      assert.strictEqual(events[1].action, "prepare");
    });

    it("should include the upcoming side in prepare events", () => {
      const steps = [
        { phaseType: "main", exerciseId: "standing-quad-stretch", side: "right", duration: 30 }
      ];
      const { events, callbacks } = collectCallbacks();
      const machine = new SessionMachine(steps, callbacks);
      machine.start();

      const prepareEvent = events.find(event => event.type === "exerciseChange");
      assert.ok(prepareEvent, "Expected prepare event");
      assert.strictEqual(prepareEvent.action, "prepare");
      assert.strictEqual(prepareEvent.side, "right");
    });
  });

  describe("tick progression", () => {
    it("should move from PREPARE to ACTIVE after prepare timer expires", () => {
      const steps = makeTestSteps();
      const { events, callbacks } = collectCallbacks();
      const machine = new SessionMachine(steps, callbacks);
      machine.start();

      // Initially in PREPARE
      assert.strictEqual(machine.state, STATE_PREPARE);

      // Fast-forward past prepare (3s)
      machine.deadline = Date.now() - 100;
      machine.tick();

      assert.strictEqual(machine.state, STATE_ACTIVE);
      assert.strictEqual(machine.substep, "active");
      assert.strictEqual(machine.currentSide, "left");
    });

    it("should use a switch countdown before the right side", () => {
      const steps = makeTestSteps();
      const machine = new SessionMachine(steps);
      machine.start();

      // Skip prepare
      machine.deadline = Date.now() - 100;
      machine.tick();

      assert.strictEqual(machine.currentSide, "left");
      assert.strictEqual(machine.state, STATE_ACTIVE);

      // Complete left side
      machine.deadline = Date.now() - 100;
      machine.tick();

      assert.strictEqual(machine.currentSide, "right");
      assert.strictEqual(machine.state, STATE_ACTIVE);
      assert.strictEqual(machine.substep, "side-switch");

      // Complete side-switch countdown
      machine.deadline = Date.now() - 100;
      machine.tick();

      assert.strictEqual(machine.currentSide, "right");
      assert.strictEqual(machine.substep, "active");
    });

    it("should advance to next step after completing both sides", () => {
      const steps = makeTestSteps();
      const machine = new SessionMachine(steps);
      machine.start();

      // Skip prepare
      machine.deadline = Date.now() - 100;
      machine.tick();

      // Complete left
      machine.deadline = Date.now() - 100;
      machine.tick();

      // Complete switch countdown
      machine.deadline = Date.now() - 100;
      machine.tick();

      // Complete right → should advance to step 1
      machine.deadline = Date.now() - 100;
      machine.tick();

      assert.strictEqual(machine.currentStepIndex, 1);
      assert.strictEqual(machine.substep, "prepare"); // Starts prepare for step 1
    });

    it("should not repeat an explicitly selected side", () => {
      const steps = [
        { phaseType: "main", exerciseId: "standing-quad-stretch", side: "left", duration: 30 },
        { phaseType: "main", exerciseId: "arm-circles", side: "both", duration: 30 }
      ];
      const machine = new SessionMachine(steps);
      machine.start();

      machine.deadline = Date.now() - 100;
      machine.tick();
      assert.strictEqual(machine.currentSide, "left");

      machine.deadline = Date.now() - 100;
      machine.tick();

      assert.strictEqual(machine.currentStepIndex, 1);
      assert.strictEqual(machine.substep, "prepare");
    });

    it("should reach COMPLETE after last step finishes", () => {
      const steps = makeTestSteps();
      const { events, callbacks } = collectCallbacks();
      const machine = new SessionMachine(steps, callbacks);

      // Manually place at last exercise's right side
      machine.state = STATE_ACTIVE;
      machine.currentStepIndex = 1;
      machine.currentSide = "both";
      machine.substep = "active";
      machine.deadline = Date.now() - 100;

      machine.tick();

      const lastEvent = events.find(e => e.type === "complete");
      assert.ok(lastEvent, "Should have emitted complete event");
      assert.strictEqual(lastEvent.completed, true);
      assert.strictEqual(machine.state, STATE_ENDED);
    });
  });

  describe("pause and resume", () => {
    it("should pause and save remaining time", () => {
      const steps = makeTestSteps();
      const machine = new SessionMachine(steps);
      machine.start();

      // Move to active
      machine.deadline = Date.now() + 5000; // 5s remaining
      machine.substep = "active";
      machine.currentSide = "left";
      machine.state = STATE_ACTIVE;

      machine.pause();
      assert.strictEqual(machine.state, STATE_PAUSED);
      assert.ok(machine.pausedRemaining > 3, "Should have saved remaining time");
    });

    it("should resume with correct deadline", () => {
      const steps = makeTestSteps();
      const machine = new SessionMachine(steps);
      machine.start();

      // Set up active state
      machine.deadline = Date.now() + 10000;
      machine.substep = "active";
      machine.currentSide = "left";
      machine.state = STATE_ACTIVE;

      machine.pause();
      const savedRemaining = machine.pausedRemaining;
      machine.resume();

      assert.strictEqual(machine.state, STATE_ACTIVE);
      // Should have restored deadline
      const newRemaining = Math.ceil((machine.deadline - Date.now()) / 1000);
      assert.ok(Math.abs(newRemaining - savedRemaining) <= 1, "Remaining should be close to saved value");
    });
  });

  describe("skip and end", () => {
    it("should skip to next step", () => {
      const steps = makeTestSteps();
      const machine = new SessionMachine(steps);
      machine.start();

      const initialIndex = machine.currentStepIndex;

      // Move to ACTIVE
      machine.deadline = Date.now() - 100;
      machine.state = STATE_ACTIVE;
      machine.substep = "active";
      machine.currentSide = "left";

      machine.skip();

      assert.strictEqual(machine.currentStepIndex, initialIndex + 1);
      assert.strictEqual(machine.substep, "prepare");
    });

    it("should skip to next step while paused", () => {
      const steps = makeTestSteps();
      const machine = new SessionMachine(steps);
      machine.start();

      machine.state = STATE_PAUSED;
      machine.substep = "active";
      machine.currentSide = "left";
      machine.pausedRemaining = 20;

      machine.skip();

      assert.strictEqual(machine.currentStepIndex, 1);
      assert.strictEqual(machine.state, STATE_PREPARE);
      assert.strictEqual(machine.substep, "prepare");
      assert.strictEqual(machine.pausedRemaining, 0);
    });

    it("should end session early", () => {
      const steps = makeTestSteps();
      const { events, callbacks } = collectCallbacks();
      const machine = new SessionMachine(steps, callbacks);
      machine.start();

      machine.end();

      const completeEvent = events.find(e => e.type === "complete");
      assert.ok(completeEvent, "Should emit complete event");
      assert.strictEqual(completeEvent.reason, "early_end");
      assert.strictEqual(machine.state, STATE_ENDED);
    });
  });

  describe("state transitions", () => {
    it("should not allow pause in PAUSED state", () => {
      const steps = makeTestSteps();
      const machine = new SessionMachine(steps);
      machine.state = STATE_PAUSED;
      machine.pause(); // should be no-op
      assert.strictEqual(machine.state, STATE_PAUSED);
    });

    it("should not allow resume in ACTIVE state", () => {
      const steps = makeTestSteps();
      const machine = new SessionMachine(steps);
      machine.state = STATE_ACTIVE;
      machine.resume(); // should be no-op
      assert.strictEqual(machine.state, STATE_ACTIVE);
    });

    it("should not allow end after ENDED", () => {
      const steps = makeTestSteps();
      const machine = new SessionMachine(steps);
      machine.state = STATE_ENDED;
      machine.end(); // should be no-op
      assert.strictEqual(machine.state, STATE_ENDED);
    });
  });

  describe("context", () => {
    it("should return current context", () => {
      const steps = makeTestSteps();
      const machine = new SessionMachine(steps);
      machine.start();

      const ctx = machine.getContext();
      assert.ok(ctx);
      assert.strictEqual(ctx.state, STATE_PREPARE);
      assert.strictEqual(ctx.stepIndex, 0);
      assert.strictEqual(ctx.totalSteps, 2);
      assert.strictEqual(ctx.exerciseId, "standing-quad-stretch");
    });
  });
});
