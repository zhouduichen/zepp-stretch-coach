import { createWidget, widget, event } from "@zos/ui";
import * as Styles from "zosLoader:./mode-pick.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { push, back } from "@zos/router";
import { getSport } from "../../data/sports";
import { recommendRoutine, estimateDuration } from "../../core/recommendation";
import { Storage } from "../../services/storage";

Page({
  state: {
    sportId: null
  },

  onInit(options) {
    const params = JSON.parse(options || "{}");
    this.sportId = params.sportId || "run-outdoor";
  },

  build() {
    const sport = getSport(this.sportId);
    if (!sport) {
      back();
      return;
    }

    const group = createWidget(widget.GROUP, Common.SCREEN_STYLE);

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    // Back navigation
    const backArea = group.createWidget(widget.FILL_RECT, {
      ...Styles.BACK_AREA_STYLE,
      color: 0x000000,
      alpha: 0
    });
    backArea.addEventListener(event.CLICK_UP, () => back());

    group.createWidget(widget.TEXT, {
      ...Styles.BACK_ARROW_STYLE,
      text: "<"
    });

    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: sport.shortName || sport.name
    });

    // Quick card
    this._buildModeCard(group, "quick", "Quick", "核心拉伸", Styles.QUICK_Y);

    // Full card
    this._buildModeCard(group, "full", "Full", "完整拉伸", Styles.FULL_Y);
  },

  _buildModeCard(group, type, label, tag, cardY) {
    const sport = getSport(this.sportId);
    const routine = recommendRoutine(this.sportId, undefined, { routineType: type });
    const dur = routine ? estimateDuration(routine.steps) : 0;
    const durMin = dur > 0 ? Math.ceil(dur / 60) : 0;
    const durStr = durMin > 0 ? `~${durMin} 分钟` : "";

    const cardX = Styles.MODE_CARD_STYLE.x;
    const cardW = Styles.MODE_CARD_STYLE.w;
    const cardH = Styles.MODE_CARD_STYLE.h;
    const MARGIN = 16;

    // Card background
    group.createWidget(widget.FILL_RECT, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      color: 0x141a15,
      alpha: 220
    });

    // Mode name
    group.createWidget(widget.TEXT, {
      x: cardX + MARGIN + 52,
      y: cardY + 12,
      w: cardW - MARGIN * 2 - 80,
      h: 28,
      color: 0xffffff,
      text_size: Styles.MODE_NAME_STYLE.text_size,
      align_h: Styles.MODE_NAME_STYLE.align_h,
      align_v: Styles.MODE_NAME_STYLE.align_v,
      text_style: 0,
      text: label
    });

    // Description
    group.createWidget(widget.TEXT, {
      x: cardX + MARGIN + 52,
      y: cardY + 44,
      w: cardW - MARGIN * 2 - 80,
      h: 24,
      color: 0x9aa497,
      text_size: Styles.MODE_DESC_STYLE.text_size,
      align_h: Styles.MODE_DESC_STYLE.align_h,
      align_v: Styles.MODE_DESC_STYLE.align_v,
      text_style: 0,
      text: durStr ? `${durStr} · ${tag}` : tag
    });

    // Arrow
    group.createWidget(widget.TEXT, {
      x: cardX + cardW - 40,
      y: cardY,
      w: 24,
      h: cardH,
      color: 0xb6f640,
      text_size: 22,
      align_h: Styles.MODE_ARROW_STYLE.align_h,
      align_v: Styles.MODE_ARROW_STYLE.align_v,
      text_style: 0,
      text: ">"
    });

    // Transparent hit target
    const hitTarget = group.createWidget(widget.FILL_RECT, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      color: 0x000000,
      alpha: 0
    });
    hitTarget.addEventListener(event.CLICK_UP, () => {
      Storage.set("recentSportId", this.sportId);
      push({
        url: "/page/session/session",
        params: JSON.stringify({
          sportId: this.sportId,
          routineType: type
        })
      });
    });
  }
});
