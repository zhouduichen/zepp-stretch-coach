import { createWidget, widget, event } from "@zos/ui";
import * as Styles from "zosLoader:./home.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { push, replace } from "@zos/router";
import { Storage } from "../../services/storage";

Page({
  state: {
    completionCount: 0
  },

  onInit() {
    Storage.migrate();

    // Auto-show safety on first launch — redirect before build()
    const safetySeen = Storage.get(Storage.KEYS.SAFETY_SEEN, false);
    if (!safetySeen) {
      replace({
        url: "/page/safety/safety",
        params: { firstLaunch: true }
      });
      return;
    }
  },

  build() {
    this.completionCount = Storage.get(Storage.KEYS.COMPLETION_COUNT, 0);

    const group = createWidget(widget.GROUP, Common.SCREEN_STYLE);

    // Background
    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    // Title
    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: "Stretch Coach"
    });

    // Subtitle
    group.createWidget(widget.TEXT, {
      ...Styles.SUBTITLE_STYLE,
      text: "Post-workout recovery"
    });

    // Start button
    const btnStart = group.createWidget(widget.IMG, Styles.START_BTN_STYLE);
    btnStart.addEventListener(event.CLICK_UP, () => {
      push({ url: "/page/select/select" });
    });

    // Safety button
    const btnSafety = group.createWidget(widget.IMG, Styles.SAFETY_BTN_STYLE);
    btnSafety.addEventListener(event.CLICK_UP, () => {
      push({ url: "/page/safety/safety" });
    });

    // Settings button
    const btnSettings = group.createWidget(widget.IMG, Styles.SETTINGS_BTN_STYLE);
    btnSettings.addEventListener(event.CLICK_UP, () => {
      push({ url: "/page/settings/settings" });
    });

    // Completion count
    group.createWidget(widget.TEXT, {
      ...Styles.COUNT_STYLE,
      text: `Completed: ${this.completionCount}`
    });
  }
});
