import { createWidget, widget, event, prop } from "@zos/ui";
import * as Styles from "zosLoader:./settings.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { back } from "@zos/router";
import { px } from "@zos/utils";
import { Storage } from "../../services/storage";
import { MODE_STANDARD, MODE_SWITCH_ONLY, MODE_OFF } from "../../services/vibration";

const MODE_OPTIONS = [
  { id: MODE_STANDARD, label: "Standard", desc: "All reminders" },
  { id: MODE_SWITCH_ONLY, label: "Switch only", desc: "Sides & complete" },
  { id: MODE_OFF, label: "Off", desc: "No vibration" }
];

Page({
  state: {
    currentMode: MODE_STANDARD,
    modeIndex: 0,
    selectedText: null
  },

  build() {
    this.state.currentMode = Storage.get(Storage.KEYS.VIBRATION_MODE, MODE_STANDARD);
    this.state.modeIndex = MODE_OPTIONS.findIndex(o => o.id === this.state.currentMode);
    if (this.state.modeIndex < 0) this.state.modeIndex = 0;

    const group = createWidget(widget.GROUP, Common.SCREEN_STYLE);

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: "Settings"
    });

    const opt = MODE_OPTIONS[this.state.modeIndex];
    group.createWidget(widget.TEXT, {
      x: px(20),
      y: Styles.OPTION_START_Y,
      w: px(300),
      h: px(35),
      color: 0xffffff,
      text_size: px(22),
      align_h: 0,
      align_v: 2,
      text_style: 0,
      text: "Vibration"
    });

    this.state.selectedText = group.createWidget(widget.TEXT, {
      x: px(20),
      y: Styles.OPTION_START_Y + px(30),
      w: px(300),
      h: px(30),
      color: 0xb8ff3d,
      text_size: px(18),
      align_h: 0,
      align_v: 2,
      text_style: 0,
      text: `${opt.label} - ${opt.desc}`
    });

    const prevBtn = group.createWidget(widget.IMG, {
      x: Styles.W - px(100),
      y: Styles.OPTION_START_Y,
      w: px(40),
      h: px(40),
      src: "btn_prev.png"
    });
    prevBtn.addEventListener(event.CLICK_UP, () => this._cycleMode(-1));

    const nextBtn = group.createWidget(widget.IMG, {
      x: Styles.W - px(50),
      y: Styles.OPTION_START_Y,
      w: px(40),
      h: px(40),
      src: "btn_next.png"
    });
    nextBtn.addEventListener(event.CLICK_UP, () => this._cycleMode(1));

    const backBtn = group.createWidget(widget.IMG, Styles.BACK_BTN_STYLE);
    backBtn.addEventListener(event.CLICK_UP, () => back());
  },

  _cycleMode(delta) {
    const count = MODE_OPTIONS.length;
    this.state.modeIndex = (this.state.modeIndex + delta + count) % count;

    const opt = MODE_OPTIONS[this.state.modeIndex];
    Storage.set(Storage.KEYS.VIBRATION_MODE, opt.id);

    if (this.state.selectedText) {
      this.state.selectedText.setProperty(prop.MORE, {
        text: `${opt.label} - ${opt.desc}`
      });
    }
  }
});
