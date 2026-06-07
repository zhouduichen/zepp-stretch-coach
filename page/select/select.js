import { createWidget, widget, event } from "@zos/ui";
import * as Styles from "zosLoader:./select.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { setScrollMode, SCROLL_MODE_FREE } from "@zos/page";
import { push } from "@zos/router";
import { getLastWorkoutSummary } from "../../services/workout-history";
import { recommendRoutine, estimateDuration, recommendFromRecentWorkout } from "../../core/recommendation";
import { SPORTS, getSport } from "../../data/sports";
import { CATEGORIES } from "../../data/categories";
import { Storage } from "../../services/storage";
import { px } from "@zos/utils";

Page({
  state: {
    selectedSportId: null,
    recommendedType: "quick",
    recommendedSportId: "run-outdoor",
    recommendation: null
  },

  build() {
    setScrollMode({ mode: SCROLL_MODE_FREE });

    const recentSportId = Storage.get("recentSportId", "run-outdoor");
    const lastWorkout = getLastWorkoutSummary();
    this.recommendation = recommendFromRecentWorkout(lastWorkout, recentSportId);
    this.recommendedType = this.recommendation ? this.recommendation.routineType : "quick";
    this.recommendedSportId = this.recommendation ? this.recommendation.sportId : recentSportId;

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
      color: 0x050806
    });

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: "Select Activity"
    });

    this._buildRecommendationCard(group);

    let yOffset = Styles.LIST_START_Y;

    for (const cat of CATEGORIES) {
      group.createWidget(widget.IMG, {
        ...Styles.CATEGORY_ICON_STYLE,
        y: yOffset + Styles.CATEGORY_ICON_OFFSET_Y,
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
        const isRecommended = sport.id === this.recommendedSportId;
        const onSportSelect = () => this._selectSport(sport.id, this.recommendedType);

        group.createWidget(widget.IMG, {
          ...Styles.ROW_CARD_STYLE,
          y: itemY
        });

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
          y: itemY + Styles.ITEM_TEXT_STYLE.y,
          color: isRecommended ? 0xb6f640 : Styles.ITEM_TEXT_STYLE.color,
          text: sport.shortName || sport.name
        });
        sportName.addEventListener(event.CLICK_UP, onSportSelect);

        const routine = recommendRoutine(sport.id, undefined, { routineType: this.recommendedType });
        const dur = routine ? estimateDuration(routine.steps) : 0;
        const durStr = dur > 0 ? `~${Math.ceil(dur / 60)} min` : "";

        const durationHint = group.createWidget(widget.TEXT, {
          ...Styles.ITEM_SUB_STYLE,
          y: itemY + Styles.ITEM_SUB_STYLE.y,
          text: isRecommended ? `Recommended · ${durStr}` : durStr
        });
        durationHint.addEventListener(event.CLICK_UP, onSportSelect);

        const recommendTag = group.createWidget(widget.TEXT, {
          ...Styles.RECOMMEND_TAG_STYLE,
          y: itemY + Styles.RECOMMEND_TAG_STYLE.y,
          text: isRecommended ? "Best" : (this.recommendedType === "full" ? "Full" : "Quick")
        });
        recommendTag.addEventListener(event.CLICK_UP, onSportSelect);

        yOffset += Styles.LIST_ITEM_H;
      }

      yOffset += Styles.CATEGORY_GAP;
    }
  },

  _buildRecommendationCard(group) {
    if (!this.recommendation) return;

    const sport = this.recommendation.sport || getSport(this.recommendation.sportId);
    if (!sport) return;

    const modeLabel = this.recommendation.routineType === "full" ? "Full" : "Quick";
    const min = this.recommendation.durationMinutes || 0;
    const sourceLabel = this.recommendation.hasWorkout ? "Last workout" : "Smart pick";
    const meta = min > 0 ? `${sourceLabel} · ${modeLabel} · ~${min} min` : `${sourceLabel} · ${modeLabel}`;
    const onStart = () => this._selectSport(this.recommendation.sportId, this.recommendation.routineType);

    const card = group.createWidget(widget.FILL_RECT, {
      ...Styles.RECOMMENDATION_CARD_STYLE,
      color: 0x141a15,
      alpha: 235
    });
    card.addEventListener(event.CLICK_UP, onStart);

    const icon = group.createWidget(widget.IMG, {
      ...Styles.RECOMMENDATION_ICON_STYLE,
      src: `${sport.icon}.png`
    });
    icon.addEventListener(event.CLICK_UP, onStart);

    const eyebrow = group.createWidget(widget.TEXT, {
      ...Styles.RECOMMENDATION_EYEBROW_STYLE,
      text: "Recommended"
    });
    eyebrow.addEventListener(event.CLICK_UP, onStart);

    const title = group.createWidget(widget.TEXT, {
      ...Styles.RECOMMENDATION_TITLE_STYLE,
      text: sport.shortName || sport.name
    });
    title.addEventListener(event.CLICK_UP, onStart);

    const subtitle = group.createWidget(widget.TEXT, {
      ...Styles.RECOMMENDATION_META_STYLE,
      text: meta
    });
    subtitle.addEventListener(event.CLICK_UP, onStart);

    const cta = group.createWidget(widget.TEXT, {
      ...Styles.RECOMMENDATION_CTA_STYLE,
      text: "START"
    });
    cta.addEventListener(event.CLICK_UP, onStart);
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

  _selectSport(sportId, routineType) {
    this.selectedSportId = sportId;
    const type = routineType || this.recommendedType;
    Storage.set("recentSportId", sportId);

    push({
      url: "/page/session/session",
      params: JSON.stringify({
        sportId: sportId,
        routineType: type
      })
    });
  }
});
