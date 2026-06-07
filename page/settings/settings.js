import { createWidget, widget, event, prop } from "@zos/ui";
import * as Styles from "zosLoader:./settings.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { back } from "@zos/router";
import { Storage } from "../../services/storage";
import { MODE_STANDARD, MODE_SWITCH_ONLY, MODE_OFF } from "../../services/vibration";

const MODE_OPTIONS = [
  { id: MODE_STANDARD, label: "Standard", desc: "All reminders" },
  { id: MODE_SWITCH_ONLY, label: "Switch", desc: "Sides & complete" },
  { id: MODE_OFF, label: "Off", desc: "No vibration" }
];

Page({
  state: {
    currentMode: MODE_STANDARD,
    modeIndex: 0,
    modeValueText: null,
    modeDescText: null,
    modeOptionRects: [],
    modeOptionTexts: [],
    weeklyGoal: 3,
    goalValueText: null
  },

  build() {
    this.state.currentMode = Storage.get(Storage.KEYS.VIBRATION_MODE, MODE_STANDARD);
    this.state.modeIndex = MODE_OPTIONS.findIndex(o => o.id === this.state.currentMode);
    if (this.state.modeIndex < 0) this.state.modeIndex = 0;
    this.state.weeklyGoal = Storage.get(Storage.KEYS.WEEKLY_GOAL, 3);

    const group = createWidget(widget.GROUP, Common.SCREEN_STYLE);

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: "Settings"
    });

    group.createWidget(widget.TEXT, {
      ...Styles.SUBTITLE_STYLE,
      text: "Recovery cues"
    });

    const opt = MODE_OPTIONS[this.state.modeIndex];
    group.createWidget(widget.FILL_RECT, {
      ...Styles.OPTION_CARD_STYLE,
      color: 0x141a15,
      alpha: 225
    });

    group.createWidget(widget.TEXT, {
      ...Styles.OPTION_LABEL_STYLE,
      text: "VIBRATION"
    });

    this.state.modeValueText = group.createWidget(widget.TEXT, {
      ...Styles.OPTION_VALUE_STYLE,
      text: opt.label
    });

    this.state.modeDescText = group.createWidget(widget.TEXT, {
      ...Styles.OPTION_DESC_STYLE,
      text: opt.desc
    });

    this.state.modeOptionRects = [];
    this.state.modeOptionTexts = [];
    for (let i = 0; i < MODE_OPTIONS.length; i++) {
      this._buildModeSegment(group, MODE_OPTIONS[i], i);
    }

    // Weekly goal section
    this._buildGoalSection(group);

    const backBtn = group.createWidget(widget.IMG, Styles.BACK_BTN_STYLE);
    backBtn.addEventListener(event.CLICK_UP, () => back());
  },

  _buildGoalSection(group) {
    const goal = this.state.weeklyGoal;

    group.createWidget(widget.FILL_RECT, {
      ...Styles.GOAL_CARD_STYLE,
      color: 0x141a15,
      alpha: 225
    });

    group.createWidget(widget.TEXT, {
      ...Styles.GOAL_LABEL_STYLE,
      text: "每周目标"
    });

    // Minus button
    const minusX = Styles.GOAL_CARD_STYLE.x + Styles.GOAL_CARD_STYLE.w - 110;
    const valueX = minusX + Styles.GOAL_STEP_BTN_STYLE.w + 4;
    const plusX = valueX + Styles.GOAL_VALUE_STYLE.w + 4;

    const btnMinus = group.createWidget(widget.TEXT, {
      x: minusX,
      y: Styles.GOAL_CARD_STYLE.y + Math.floor((Styles.GOAL_CARD_STYLE.h - Styles.GOAL_STEP_BTN_STYLE.h) / 2),
      ...Styles.GOAL_STEP_BTN_STYLE,
      text: "-"
    });
    btnMinus.addEventListener(event.CLICK_UP, () => this._adjustGoal(-1));

    this.state.goalValueText = group.createWidget(widget.TEXT, {
      x: valueX,
      y: Styles.GOAL_CARD_STYLE.y + Math.floor((Styles.GOAL_CARD_STYLE.h - Styles.GOAL_VALUE_STYLE.h) / 2),
      ...Styles.GOAL_VALUE_STYLE,
      text: `${goal}`
    });

    const btnPlus = group.createWidget(widget.TEXT, {
      x: plusX,
      y: Styles.GOAL_CARD_STYLE.y + Math.floor((Styles.GOAL_CARD_STYLE.h - Styles.GOAL_STEP_BTN_STYLE.h) / 2),
      ...Styles.GOAL_STEP_BTN_STYLE,
      text: "+"
    });
    btnPlus.addEventListener(event.CLICK_UP, () => this._adjustGoal(1));
  },

  _adjustGoal(delta) {
    const newGoal = Math.max(1, Math.min(7, this.state.weeklyGoal + delta));
    if (newGoal === this.state.weeklyGoal) return;
    this.state.weeklyGoal = newGoal;
    Storage.set(Storage.KEYS.WEEKLY_GOAL, newGoal);
    if (this.state.goalValueText) {
      this.state.goalValueText.setProperty(prop.MORE, { text: `${newGoal}` });
    }
  },

  _buildModeSegment(group, opt, index) {
    const x = Styles.MODE_SEGMENT_STYLE.x + index * (Styles.MODE_SEGMENT_STYLE.w + Styles.MODE_SEGMENT_GAP);
    const selected = index === this.state.modeIndex;
    const onSelect = () => this._selectMode(index);

    const rect = group.createWidget(widget.FILL_RECT, {
      x: x,
      y: Styles.MODE_SEGMENT_STYLE.y,
      w: Styles.MODE_SEGMENT_STYLE.w,
      h: Styles.MODE_SEGMENT_STYLE.h,
      color: selected ? 0xb6f640 : 0x1e251f,
      alpha: selected ? 235 : 215
    });
    rect.addEventListener(event.CLICK_UP, onSelect);

    const text = group.createWidget(widget.TEXT, {
      ...Styles.MODE_SEGMENT_TEXT_STYLE,
      x: x,
      y: Styles.MODE_SEGMENT_STYLE.y,
      color: selected ? 0x050806 : 0xf6f9f4,
      text: opt.label
    });
    text.addEventListener(event.CLICK_UP, onSelect);

    this.state.modeOptionRects[index] = rect;
    this.state.modeOptionTexts[index] = text;
  },

  _selectMode(index) {
    if (index < 0 || index >= MODE_OPTIONS.length) return;
    this.state.modeIndex = index;
    const opt = MODE_OPTIONS[this.state.modeIndex];
    Storage.set(Storage.KEYS.VIBRATION_MODE, opt.id);

    if (this.state.modeValueText) this.state.modeValueText.setProperty(prop.MORE, { text: opt.label });
    if (this.state.modeDescText) this.state.modeDescText.setProperty(prop.MORE, { text: opt.desc });
    this._syncModeSegments();
  },

  _syncModeSegments() {
    for (let i = 0; i < MODE_OPTIONS.length; i++) {
      const selected = i === this.state.modeIndex;
      if (this.state.modeOptionRects[i]) {
        this.state.modeOptionRects[i].setProperty(prop.MORE, {
          color: selected ? 0xb6f640 : 0x1e251f,
          alpha: selected ? 235 : 215
        });
      }
      if (this.state.modeOptionTexts[i]) {
        this.state.modeOptionTexts[i].setProperty(prop.MORE, {
          color: selected ? 0x050806 : 0xf6f9f4
        });
      }
    }
  }
});
