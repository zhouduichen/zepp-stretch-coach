import { createWidget, deleteWidget, widget, event, prop, anim_status } from "@zos/ui";
import * as Styles from "zosLoader:./session.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { replace } from "@zos/router";
import { pauseDropWristScreenOff, resetDropWristScreenOff } from "@zos/display";
import { setScrollLock } from "@zos/page";
import { SessionMachine, STATE_PREPARE, STATE_ACTIVE, STATE_PAUSED } from "../../core/session-machine";
import { recommendRoutine } from "../../core/recommendation";
import { getExercise } from "../../data/exercises";
import { Vibration } from "../../services/vibration";
import { Storage } from "../../services/storage";

Page({
  state: {
    machine: null,
    timerId: null,
    completionNavTimer: null,
    animWidget: null,
    exerciseNameText: null,
    sideText: null,
    timerText: null,
    progressText: null,
    pausedGroup: null,
    lastAnimationKey: null,
    lastTickSecond: -1,
    lastIntervalTickSecond: -1
  },

  onInit(options) {
    pauseDropWristScreenOff({ duration: 0 });

    const params = JSON.parse(options || "{}");
    const sportId = params.sportId || "run-outdoor";
    const routineType = params.routineType || "quick";
    this._sportId = sportId;
    this._routineType = routineType;
    this.state._lastExerciseName = null;
    this.state._lastSideLabel = null;
    this.state._lastTimerText = null;
    this.state._lastProgressText = null;

    Vibration.setMode(Storage.get(Storage.KEYS.VIBRATION_MODE, "standard"));

    const result = recommendRoutine(sportId, undefined, { routineType });
    if (!result || !result.steps.length) {
      replace({ url: "/page/home/home" });
      return;
    }

    this.state.machine = new SessionMachine(result.steps, {
      onStateChange: (oldState, newState) => this._onStateChange(oldState, newState),
      onExerciseChange: (info) => this._onExerciseChange(info),
      onTick: (remaining, ctx) => this._onTick(remaining, ctx),
      onComplete: (info) => this._onComplete(info)
    });
  },

  build() {
    if (!this.state.machine) return;

    setScrollLock({ lock: true });
    const group = createWidget(widget.GROUP, Common.SCREEN_STYLE);

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    this.state.exerciseNameText = group.createWidget(widget.TEXT, Styles.EXERCISE_NAME_STYLE);
    this.state.sideText = group.createWidget(widget.TEXT, Styles.SIDE_STYLE);
    this.state.timerText = group.createWidget(widget.TEXT, Styles.TIMER_STYLE);
    this.state.progressText = group.createWidget(widget.TEXT, Styles.PROGRESS_STYLE);

    const btnPause = group.createWidget(widget.IMG, Styles.PAUSE_BTN_STYLE);
    btnPause.addEventListener(event.CLICK_UP, () => this._togglePause());

    this.state.machine.start();
    this._updateDisplay();
    this._ensureTickTimer();
  },

  _ensureTickTimer() {
    if (this.state.timerId || !this.state.machine) return;
    this.state.timerId = setInterval(() => this.state.machine.tick(), 1000);
  },

  _clearTickTimer() {
    if (!this.state.timerId) return;
    clearInterval(this.state.timerId);
    this.state.timerId = null;
  },

  _togglePause() {
    if (this.state.machine.state === STATE_PAUSED) {
      this.state.machine.resume();
      this._hidePauseOverlay();
    } else if (this.state.machine.state === STATE_ACTIVE || this.state.machine.state === STATE_PREPARE) {
      this.state.machine.pause();
      this._showPauseOverlay();
    }
  },

  _showPauseOverlay() {
    if (this.state.pausedGroup) return;

    const group = createWidget(widget.GROUP, { x: 0, y: 0, w: Styles.W, h: Styles.H });
    group.createWidget(widget.FILL_RECT, Styles.OVERLAY_BG_STYLE);
    group.createWidget(widget.TEXT, {
      ...Styles.PAUSED_TEXT_STYLE,
      text: "Paused"
    });

    const btnResume = group.createWidget(widget.IMG, Styles.RESUME_BTN_STYLE);
    btnResume.addEventListener(event.CLICK_UP, () => {
      this.state.machine.resume();
      this._hidePauseOverlay();
    });

    const btnSkip = group.createWidget(widget.IMG, Styles.SKIP_BTN_STYLE);
    btnSkip.addEventListener(event.CLICK_UP, () => {
      this.state.machine.skip();
      this._hidePauseOverlay();
      this._updateDisplay();
    });

    const btnEnd = group.createWidget(widget.IMG, Styles.END_BTN_STYLE);
    btnEnd.addEventListener(event.CLICK_UP, () => {
      this.state.machine.end();
      this._hidePauseOverlay();
    });

    this.state.pausedGroup = group;
  },

  _hidePauseOverlay() {
    if (!this.state.pausedGroup) return;
    deleteWidget(this.state.pausedGroup);
    this.state.pausedGroup = null;
  },

  _onStateChange(oldState, newState) {
    if (newState === STATE_PAUSED) {
      this._clearTickTimer();
    } else if (oldState === STATE_PAUSED) {
      this._ensureTickTimer();
    }
  },

  _onExerciseChange(info) {
    console.log(`Exercise: ${info.action} - ${info.exerciseId}`);
    this.state.lastTickSecond = -1;
    this.state.lastIntervalTickSecond = -1;

    if (info.action === "prepare") {
      Vibration.clearAll();
      this._loadAnimation(info.exerciseId, info.side);
    } else if (info.action === "start") {
      this._loadAnimation(info.exerciseId, info.side);
      Vibration.exerciseStart();
    } else if (info.action === "side_switch" || info.action === "side_start") {
      this._loadAnimation(info.exerciseId, info.side);
      if (info.action === "side_switch") {
        Vibration.sideSwitch();
      }
    }
  },

  _onTick(remaining, ctx) {
    const tickSecond = Math.ceil(remaining);

    if (ctx.state === STATE_ACTIVE && ctx.substep === "active") {
      if (
        tickSecond > 3
        && tickSecond % 10 === 0
        && tickSecond !== this.state.lastIntervalTickSecond
      ) {
        this.state.lastIntervalTickSecond = tickSecond;
        Vibration.intervalTick();
      }

      if (
        tickSecond <= 3
        && tickSecond > 0
        && tickSecond !== this.state.lastTickSecond
      ) {
        this.state.lastTickSecond = tickSecond;
        Vibration.finalCountdown();
      }
    }

    this._updateDisplay();
  },

  _onComplete(info) {
    this._clearTickTimer();
    this.state.lastTickSecond = -1;
    this.state.lastIntervalTickSecond = -1;

    if (info.completed) {
      const count = Storage.get(Storage.KEYS.COMPLETION_COUNT, 0);
      Storage.set(Storage.KEYS.COMPLETION_COUNT, count + 1);
      Vibration.clearAll();
      Vibration.complete();
    } else {
      Vibration.clearAll();
    }

    this.state.completionNavTimer = setTimeout(() => {
      replace({
        url: "/page/complete/complete",
        params: JSON.stringify({
          completed: info.completed,
          reason: info.reason,
          sportId: this._sportId || "",
          routineType: this._routineType || "quick",
          totalSteps: this.state.machine.steps.length,
          totalDuration: this._computeTotalDuration()
        })
      });
    }, info.completed ? 1250 : 0);
  },

  _updateDisplay() {
    const ctx = this.state.machine.getContext();
    if (!ctx) return;

    const step = this.state.machine.steps[this.state.machine.currentStepIndex];
    if (!step) return;

    const ex = getExercise(step.exerciseId);
    if (this.state.exerciseNameText && ex) {
      const name = ex.name;
      if (this.state._lastExerciseName !== name) {
        this.state._lastExerciseName = name;
        this.state.exerciseNameText.setProperty(prop.MORE, { text: name });
      }
    }

    if (this.state.sideText) {
      let sideLabel = "";
      if (ctx.substep === "prepare") sideLabel = "Get ready...";
      else if (ctx.substep === "side-switch") sideLabel = "Switch sides...";
      else if (ctx.side === "left") sideLabel = "Left side";
      else if (ctx.side === "right") sideLabel = "Right side";

      if (this.state._lastSideLabel !== sideLabel) {
        this.state._lastSideLabel = sideLabel;
        this.state.sideText.setProperty(prop.MORE, { text: sideLabel });
      }
    }

    if (this.state.timerText) {
      const remaining = Math.max(0, Math.ceil((this.state.machine.deadline - Date.now()) / 1000));
      const text = String(remaining);
      if (this.state._lastTimerText !== text) {
        this.state._lastTimerText = text;
        this.state.timerText.setProperty(prop.MORE, { text });
      }
    }

    if (this.state.progressText) {
      const total = this.state.machine.steps.length;
      const current = Math.min(this.state.machine.currentStepIndex + 1, total);
      const text = `${current} / ${total}`;
      if (this.state._lastProgressText !== text) {
        this.state._lastProgressText = text;
        this.state.progressText.setProperty(prop.MORE, { text });
      }
    }
  },

  _resolveAnimationPrefix(ex, side) {
    if (ex.sides === "single" && (side === "left" || side === "right")) {
      return `${ex.animPrefix}_${side}`;
    }
    return ex.animPrefix;
  },

  _loadAnimation(exerciseId, side) {
    const ex = getExercise(exerciseId);
    if (!ex) return;

    const animationPrefix = this._resolveAnimationPrefix(ex, side);
    const animationKey = `${animationPrefix}:${ex.animFrames || 4}:${ex.animFps || 3}`;
    if (this.state.animWidget && this.state.lastAnimationKey === animationKey) return;

    this._destroyAnimation();

    try {
      this.state.animWidget = createWidget(widget.IMG_ANIM, {
        anim_path: `animations/${animationPrefix}`,
        anim_prefix: "f",
        anim_ext: "png",
        anim_fps: ex.animFps || 3,
        anim_size: ex.animFrames || 4,
        repeat_count: 0,
        anim_status: 3,
        x: Styles.ANIM_STYLE.x,
        y: Styles.ANIM_STYLE.y,
        w: Styles.ANIM_STYLE.w,
        h: Styles.ANIM_STYLE.h,
        auto_scale: true,
        auto_scale_obj_fit: true
      });
      this.state.lastAnimationKey = animationKey;
      this.state.animWidget.setProperty(prop.ANIM_STATUS, anim_status.START);
    } catch (e) {
      console.log(`Animation load error: ${e}`);
    }
  },

  _destroyAnimation() {
    if (!this.state.animWidget) return;

    try {
      this.state.animWidget.setProperty(prop.ANIM_STATUS, anim_status.STOP);
      deleteWidget(this.state.animWidget);
    } catch (e) {
      console.log(`Animation destroy error: ${e}`);
    }
    this.state.animWidget = null;
    this.state.lastAnimationKey = null;
  },

  _computeTotalDuration() {
    let total = 0;
    for (const step of this.state.machine.steps) {
      const dur = step.duration || 30;
      if (step.side === "single") {
        total += 3 + dur + 3 + dur;
      } else {
        total += 3 + dur;
      }
    }
    return total;
  },

  onDestroy() {
    this._clearTickTimer();

    if (this.state.completionNavTimer) {
      clearTimeout(this.state.completionNavTimer);
      this.state.completionNavTimer = null;
    }

    if (this.state.machine) this.state.machine.destroy();

    this._destroyAnimation();
    Vibration.clearAll();
    setScrollLock({ lock: false });
    resetDropWristScreenOff();
  }
});
