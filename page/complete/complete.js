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

    group.createWidget(widget.IMG, {
      ...Styles.RESULT_BADGE_STYLE,
      src: this.completed ? "icon_complete.png" : "icon_stop.png"
    });

    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: this.completed ? "Great job!" : "Ended early"
    });

    const sport = getSport(this.sportId);
    const sportName = sport ? (sport.shortName || sport.name) : "";
    const modeLabel = this.routineType === "quick" ? "Quick" : "Full";
    group.createWidget(widget.TEXT, {
      ...Styles.SUBTITLE_STYLE,
      text: sportName ? `${sportName} · ${modeLabel}` : modeLabel
    });

    group.createWidget(widget.TEXT, {
      ...Styles.STATUS_STYLE,
      color: this.completed ? Styles.STATUS_STYLE.color : 0xff5b81,
      text: this.completed ? "Stretch complete" : "Session stopped"
    });

    group.createWidget(widget.FILL_RECT, {
      ...Styles.SUMMARY_CARD_STYLE,
      color: 0x141a15,
      alpha: 230
    });

    group.createWidget(widget.FILL_RECT, {
      ...Styles.SUMMARY_ACCENT_STYLE,
      color: this.completed ? 0xb6f640 : 0xff5b81,
      alpha: 235
    });

    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_VALUE_1_STYLE,
      text: `${this.totalSteps}`
    });
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_LABEL_1_STYLE,
      text: "Moves"
    });

    const min = this.totalDuration > 0 ? Math.ceil(this.totalDuration / 60) : 0;
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_VALUE_2_STYLE,
      text: `~${min} min`
    });
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_LABEL_2_STYLE,
      text: "Time"
    });

    const count = Storage.get(Storage.KEYS.COMPLETION_COUNT, 0);
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_VALUE_3_STYLE,
      text: `${Math.min(count, 3)}/3`
    });
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_LABEL_3_STYLE,
      text: "Week"
    });

    const btnHome = group.createWidget(widget.IMG, Styles.HOME_BTN_STYLE);
    btnHome.addEventListener(event.CLICK_UP, () => {
      replace({ url: "/page/home/home" });
    });
  }
});
