import { createWidget, widget, event } from "@zos/ui";
import * as Styles from "zosLoader:./complete.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { replace } from "@zos/router";

Page({
  state: {
    completed: true,
    reason: "all_done"
  },

  onInit(options) {
    if (options) {
      try {
        const params = JSON.parse(options);
        this.completed = params.completed !== false;
        this.reason = params.reason || "all_done";
      } catch (e) {}
    }
  },

  build() {
    const group = createWidget(widget.GROUP, Common.SCREEN_STYLE);

    // Background
    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    // Title
    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: this.completed ? "Great job!" : "Session ended"
    });

    // Icon area
    group.createWidget(widget.IMG, {
      ...Styles.ICON_STYLE,
      src: this.completed ? "icon_complete.png" : "icon_stop.png"
    });

    // Message
    const message = this.completed
      ? "All stretches completed."
      : "Session stopped early.";

    group.createWidget(widget.TEXT, {
      ...Styles.MESSAGE_STYLE,
      text: message
    });

    // Home button
    const btnHome = group.createWidget(widget.IMG, Styles.HOME_BTN_STYLE);
    btnHome.addEventListener(event.CLICK_UP, () => {
      replace({ url: "/page/home/home" });
    });
  }
});
