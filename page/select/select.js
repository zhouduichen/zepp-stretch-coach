import { createWidget, widget, event, prop } from "@zos/ui";
import * as Styles from "zosLoader:./select.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { setScrollMode, SCROLL_MODE_FREE } from "@zos/page";
import { push } from "@zos/router";
import { recommendByWorkout } from "../../services/workout-history";
import { recommendRoutine, estimateDuration } from "../../core/recommendation";
import { SPORTS, getSport } from "../../data/sports";
import { CATEGORIES } from "../../data/categories";
import { px } from "@zos/utils";

Page({
  state: {
    selectedSportId: null,
    recommendedType: "quick"
  },

  build() {
    setScrollMode({ mode: SCROLL_MODE_FREE });

    this.recommendedType = recommendByWorkout();

    const contentHeight = this._getContentHeight();
    const group = createWidget(widget.GROUP, {
      x: px(0),
      y: px(0),
      w: Styles.W,
      h: contentHeight
    });

    group.createWidget(widget.FILL_RECT, {
      x: px(0),
      y: px(0),
      w: Styles.W,
      h: contentHeight,
      color: 0x050b14
    });

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: "Select Activity"
    });

    let yOffset = Styles.LIST_START_Y;

    for (const cat of CATEGORIES) {
      group.createWidget(widget.IMG, {
        ...Styles.CATEGORY_ICON_STYLE,
        y: yOffset + px(3),
        src: `${cat.icon}.png`
      });

      // Category header
      group.createWidget(widget.TEXT, {
        ...Styles.CATEGORY_TEXT_STYLE,
        y: yOffset,
        text: cat.name
      });
      yOffset += Styles.CATEGORY_H;

      const sports = SPORTS.filter(s => s.categoryId === cat.id);
      for (const sport of sports) {
        const itemY = yOffset;
        const onSportSelect = () => this._selectSport(sport.id);

        const rowTarget = group.createWidget(widget.FILL_RECT, {
          ...Styles.ROW_BG_STYLE,
          y: itemY
        });
        rowTarget.addEventListener(event.CLICK_UP, onSportSelect);

        const sportIcon = group.createWidget(widget.IMG, {
          ...Styles.SPORT_ICON_STYLE,
          y: itemY + px(8),
          src: `${sport.icon}.png`
        });
        sportIcon.addEventListener(event.CLICK_UP, onSportSelect);

        const sportName = group.createWidget(widget.TEXT, {
          ...Styles.ITEM_TEXT_STYLE,
          y: itemY,
          text: sport.shortName || sport.name
        });
        sportName.addEventListener(event.CLICK_UP, onSportSelect);

        const routine = recommendRoutine(sport.id, undefined, { routineType: this.recommendedType });
        const dur = routine ? estimateDuration(routine.steps) : 0;
        const durStr = dur > 0 ? `~${Math.ceil(dur / 60)} min` : "";

        const durationHint = group.createWidget(widget.TEXT, {
          ...Styles.ITEM_SUB_STYLE,
          y: itemY,
          text: durStr
        });
        durationHint.addEventListener(event.CLICK_UP, onSportSelect);

        const recommendTag = group.createWidget(widget.TEXT, {
          ...Styles.RECOMMEND_TAG_STYLE,
          y: itemY,
          text: this.recommendedType === "full" ? "Full" : "Quick"
        });
        recommendTag.addEventListener(event.CLICK_UP, onSportSelect);

        yOffset += Styles.LIST_ITEM_H;
      }

      yOffset += Styles.CATEGORY_GAP;
    }
  },

  _getContentHeight() {
    let height = Styles.LIST_START_Y;
    for (const cat of CATEGORIES) {
      height += Styles.CATEGORY_H;
      height += SPORTS.filter(s => s.categoryId === cat.id).length * Styles.LIST_ITEM_H;
      height += Styles.CATEGORY_GAP;
    }
    return Math.max(Styles.H, height + Styles.BOTTOM_PADDING);
  },

  _selectSport(sportId) {
    this.selectedSportId = sportId;
    const sport = getSport(sportId);

    push({
      url: "/page/session/session",
      params: JSON.stringify({
        sportId: sportId,
        routineType: this.recommendedType
      })
    });
  }
});
