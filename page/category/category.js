import { createWidget, widget, event } from "@zos/ui";
import * as Styles from "zosLoader:./category.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { push, back } from "@zos/router";
import { setScrollMode, SCROLL_MODE_FREE } from "@zos/page";
import { getSportsByCategory } from "../../data/sports";
import { getCategory } from "../../data/categories";
import { recommendRoutine, estimateDuration } from "../../core/recommendation";
import { px } from "@zos/utils";

Page({
  state: {
    categoryId: null,
    sports: []
  },

  onInit(options) {
    const params = JSON.parse(options || "{}");
    this.categoryId = params.categoryId || "cardio";
    this.sports = getSportsByCategory(this.categoryId);
  },

  build() {
    setScrollMode({ mode: SCROLL_MODE_FREE });

    const cat = getCategory(this.categoryId);
    const title = cat ? `${cat.name} 拉伸` : "拉伸方案";

    const totalH = Styles.LIST_START_Y + this.sports.length * Styles.LIST_ITEM_H + Styles.BOTTOM_PADDING;
    const contentH = Math.max(Styles.H, totalH);

    const group = createWidget(widget.GROUP, {
      x: px(0),
      y: px(0),
      w: Styles.W,
      h: contentH
    });

    // Dark background fill
    group.createWidget(widget.FILL_RECT, {
      x: px(0),
      y: px(0),
      w: Styles.W,
      h: contentH,
      color: 0x050806
    });

    // Background image
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

    // Title
    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: title
    });

    // Sport list
    let yOffset = Styles.LIST_START_Y;

    for (const sport of this.sports) {
      const itemY = yOffset;
      const onSelect = () => {
        this._selectSport(sport.id);
      };

      // Row card background
      group.createWidget(widget.FILL_RECT, {
        x: Styles.ROW_CARD_STYLE.x,
        y: itemY,
        w: Styles.ROW_CARD_STYLE.w,
        h: Styles.ROW_CARD_STYLE.h,
        color: 0x141a15,
        alpha: 220
      });

      // Sport icon
      const iconY = itemY + Math.floor((Styles.ROW_CARD_STYLE.h - Styles.SPORT_ICON_STYLE.h) / 2);
      group.createWidget(widget.IMG, {
        x: Styles.SPORT_ICON_STYLE.x,
        y: iconY,
        w: Styles.SPORT_ICON_STYLE.w,
        h: Styles.SPORT_ICON_STYLE.h,
        src: `${sport.icon}.png`
      });

      // Sport name
      group.createWidget(widget.TEXT, {
        ...Styles.ITEM_TEXT_STYLE,
        y: itemY + Styles.ITEM_TEXT_STYLE.y,
        text: sport.shortName || sport.name
      });

      // Duration hint
      const routine = recommendRoutine(sport.id, undefined, { routineType: "quick" });
      const dur = routine ? estimateDuration(routine.steps) : 0;
      const durMin = dur > 0 ? Math.ceil(dur / 60) : 0;
      const envLabel = sport.environment === "indoor" ? "室内" : "户外";
      const durStr = durMin > 0 ? `${envLabel} · ~${durMin} min · Quick` : envLabel;

      group.createWidget(widget.TEXT, {
        ...Styles.ITEM_SUB_STYLE,
        y: itemY + Styles.ITEM_SUB_STYLE.y,
        text: durStr
      });

      // Arrow
      group.createWidget(widget.TEXT, {
        ...Styles.ITEM_ARROW_STYLE,
        y: itemY,
        text: ">"
      });

      // Transparent hit target
      const hitTarget = group.createWidget(widget.FILL_RECT, {
        x: Styles.ROW_CARD_STYLE.x,
        y: itemY,
        w: Styles.ROW_CARD_STYLE.w,
        h: Styles.ROW_CARD_STYLE.h,
        color: 0x000000,
        alpha: 0
      });
      hitTarget.addEventListener(event.CLICK_UP, onSelect);

      yOffset += Styles.LIST_ITEM_H;
    }
  },

  _selectSport(sportId) {
    push({
      url: "/page/mode-pick/mode-pick",
      params: JSON.stringify({ sportId: sportId })
    });
  }
});
