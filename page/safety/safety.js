import { createWidget, widget, event } from "@zos/ui";
import * as Styles from "zosLoader:./safety.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { back, replace } from "@zos/router";
import { Storage } from "../../services/storage";

Page({
  state: {
    firstLaunch: false
  },

  onInit(options) {
    const params = JSON.parse(options || "{}");
    this.state.firstLaunch = params.firstLaunch === true;
  },

  build() {
    const group = createWidget(widget.GROUP, Common.SCREEN_STYLE);

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: "Safety Guidelines"
    });

    const safetyText =
      "- Stop if you feel pain or dizziness\n"
      + "- Stretch gently. Never bounce\n"
      + "- Keep breathing naturally\n"
      + "- Use stable support when shown\n"
      + "- Follow professional advice if injured\n"
      + "- This is not medical advice";

    group.createWidget(widget.TEXT, {
      ...Styles.CONTENT_STYLE,
      text: safetyText
    });

    const btnDismiss = group.createWidget(widget.IMG, Styles.DISMISS_BTN_STYLE);
    btnDismiss.addEventListener(event.CLICK_UP, () => {
      Storage.set(Storage.KEYS.SAFETY_SEEN, true);
      if (this.state.firstLaunch) {
        replace({ url: "/page/home/home" });
      } else {
        back();
      }
    });
  }
});
