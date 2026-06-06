import { createWidget, widget, event } from "@zos/ui";
import * as Styles from "zosLoader:./complete.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { replace } from "@zos/router";
import { Storage } from "../../services/storage";
import { getSport } from "../../data/sports";

Page({
  state: {
    completed: true,
    reason: "all_done",
    sportId: "",
    routineType: "quick",
    totalSteps: 0,
    totalDuration: 0
  },

  onInit(options) {
    if (options) {
      try {
        const params = JSON.parse(options);
        this.completed = params.completed !== false;
        this.reason = params.reason || "all_done";
        this.sportId = params.sportId || "";
        this.routineType = params.routineType || "quick";
        this.totalSteps = params.totalSteps || 0;
        this.totalDuration = params.totalDuration || 0;
      } catch (e) {}
    }
  },

  build() {
    const group = createWidget(widget.GROUP, Common.SCREEN_STYLE);

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    // Title
    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: this.completed ? "Great job!" : "早退了"
    });

    // Subtitle: sport name + mode
    const sport = getSport(this.sportId);
    const sportName = sport ? (sport.shortName || sport.name) : "";
    const modeLabel = this.routineType === "quick" ? "Quick" : "Full";
    group.createWidget(widget.TEXT, {
      ...Styles.SUBTITLE_STYLE,
      text: sportName ? `${sportName} · ${modeLabel}` : ""
    });

    // Status
    group.createWidget(widget.TEXT, {
      ...Styles.STATUS_STYLE,
      text: this.completed ? "所有拉伸已完成" : "训练提前结束"
    });

    // Summary card background
    group.createWidget(widget.FILL_RECT, {
      ...Styles.SUMMARY_CARD_STYLE,
      color: 0x141a15,
      alpha: 220
    });

    // Steps count
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_VALUE_1_STYLE,
      text: `${this.totalSteps}`
    });
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_LABEL_1_STYLE,
      text: "动作"
    });

    // Duration
    const min = this.totalDuration > 0 ? Math.ceil(this.totalDuration / 60) : 0;
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_VALUE_2_STYLE,
      text: `~${min} min`
    });
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_LABEL_2_STYLE,
      text: "时长"
    });

    // Weekly progress
    const count = Storage.get(Storage.KEYS.COMPLETION_COUNT, 0);
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_VALUE_3_STYLE,
      text: `${Math.min(count, 3)}/3`
    });
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_LABEL_3_STYLE,
      text: "本周"
    });

    // HOME button
    const btnHome = group.createWidget(widget.IMG, Styles.HOME_BTN_STYLE);
    btnHome.addEventListener(event.CLICK_UP, () => {
      replace({ url: "/page/home/home" });
    });
  }
});
