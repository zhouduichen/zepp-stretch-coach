import { createWidget, widget, event } from "@zos/ui";
import * as Styles from "zosLoader:./home.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { push, replace } from "@zos/router";
import { Storage } from "../../services/storage";
import { CATEGORIES } from "../../data/categories";
import { SPORTS } from "../../data/sports";

Page({
  state: {
    completionCount: 0,
    weeklyGoal: 3
  },

  onInit() {
    Storage.migrate();

    // First launch: show safety guidelines before home
    const safetySeen = Storage.get(Storage.KEYS.SAFETY_SEEN, false);
    if (!safetySeen) {
      replace({ url: "/page/safety/safety", params: JSON.stringify({ firstLaunch: true }) });
      return;
    }
  },

  build() {
    this.completionCount = Storage.get(Storage.KEYS.COMPLETION_COUNT, 0);
    const weeklyGoal = Storage.get(Storage.KEYS.WEEKLY_GOAL, 3);
    const completedForGoal = Math.min(this.completionCount, weeklyGoal);
    const barW = Styles.PROGRESS_BG_STYLE.w;
    const pctWidth = completedForGoal === 0 ? 0 : Math.round((completedForGoal / weeklyGoal) * barW);

    // Precompute sport counts per category
    const sportCounts = {};
    for (const cat of CATEGORIES) {
      sportCounts[cat.id] = SPORTS.filter(s => s.categoryId === cat.id).length;
    }

    const group = createWidget(widget.GROUP, Common.SCREEN_STYLE);

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    // Weekly progress bar
    group.createWidget(widget.TEXT, {
      ...Styles.PROGRESS_LABEL_STYLE,
      text: "每周目标"
    });
    group.createWidget(widget.TEXT, {
      ...Styles.PROGRESS_VALUE_STYLE,
      text: `${completedForGoal} / ${weeklyGoal}`
    });
    group.createWidget(widget.FILL_RECT, Styles.PROGRESS_BG_STYLE);
    if (pctWidth > 0) {
      group.createWidget(widget.FILL_RECT, {
        x: Styles.PROGRESS_FILL_STYLE.x,
        y: Styles.PROGRESS_FILL_STYLE.y,
        w: pctWidth,
        h: Styles.PROGRESS_FILL_STYLE.h,
        color: 0xb6f640
      });
    }

    // Three category cards
    const catYs = [Styles.CAT1_Y, Styles.CAT2_Y, Styles.CAT3_Y];
    for (let i = 0; i < CATEGORIES.length; i++) {
      this._buildCategoryCard(group, CATEGORIES[i], catYs[i], sportCounts[CATEGORIES[i].id]);
    }

    // START button
    const btnStart = group.createWidget(widget.IMG, Styles.START_BTN_STYLE);
    btnStart.addEventListener(event.CLICK_UP, () => {
      const recentSportId = Storage.get("recentSportId", null);
      if (recentSportId) {
        push({ url: "/page/mode-pick/mode-pick", params: JSON.stringify({ sportId: recentSportId }) });
      } else {
        push({
          url: "/page/category/category",
          params: JSON.stringify({ categoryId: CATEGORIES[0].id })
        });
      }
    });

    // Bottom GUIDE link
    const btnGuide = group.createWidget(widget.TEXT, {
      ...Styles.GUIDE_BTN_STYLE,
      text: "指南"
    });
    btnGuide.addEventListener(event.CLICK_UP, () => {
      push({ url: "/page/safety/safety" });
    });

    // Bottom VIBRATION link
    const btnVib = group.createWidget(widget.TEXT, {
      ...Styles.VIBRATION_BTN_STYLE,
      text: "震动"
    });
    btnVib.addEventListener(event.CLICK_UP, () => {
      push({ url: "/page/settings/settings" });
    });
  },

  _buildCategoryCard(group, cat, y, subCount) {
    const cardX = Styles.CAT_CARD_STYLE.x;
    const cardW = Styles.CAT_CARD_STYLE.w;
    const cardH = Styles.CAT_CARD_STYLE.h;

    // Card background
    group.createWidget(widget.FILL_RECT, {
      x: cardX,
      y: y,
      w: cardW,
      h: cardH,
      color: 0x141a15,
      alpha: 220
    });

    // Icon
    group.createWidget(widget.IMG, {
      x: cardX + 16,
      y: y + Math.floor((cardH - Styles.CAT_ICON_STYLE.h) / 2),
      w: Styles.CAT_ICON_STYLE.w,
      h: Styles.CAT_ICON_STYLE.h,
      src: `${cat.icon}.png`
    });

    // Name
    group.createWidget(widget.TEXT, {
      x: cardX + 60,
      y: y + 8,
      w: cardW - 100,
      h: 24,
      color: 0xffffff,
      text_size: Styles.CAT_NAME_STYLE.text_size,
      align_h: Styles.CAT_NAME_STYLE.align_h,
      align_v: Styles.CAT_NAME_STYLE.align_v,
      text_style: 0,
      text: cat.name
    });

    // Subtitle (sport count)
    group.createWidget(widget.TEXT, {
      x: cardX + 60,
      y: y + 34,
      w: cardW - 100,
      h: 22,
      color: 0x9aa497,
      text_size: Styles.CAT_SUB_STYLE.text_size,
      align_h: Styles.CAT_SUB_STYLE.align_h,
      align_v: Styles.CAT_SUB_STYLE.align_v,
      text_style: 0,
      text: `${subCount} 个拉伸方案`
    });

    // Arrow
    group.createWidget(widget.TEXT, {
      x: cardX + cardW - 40,
      y: y,
      w: 24,
      h: cardH,
      color: 0xb6f640,
      text_size: 22,
      align_h: Styles.CAT_ARROW_STYLE.align_h,
      align_v: Styles.CAT_ARROW_STYLE.align_v,
      text_style: 0,
      text: ">"
    });

    // Transparent hit target
    const hitTarget = group.createWidget(widget.FILL_RECT, {
      x: cardX,
      y: y,
      w: cardW,
      h: cardH,
      color: 0x000000,
      alpha: 0
    });
    hitTarget.addEventListener(event.CLICK_UP, () => {
      push({
        url: "/page/category/category",
        params: JSON.stringify({ categoryId: cat.id })
      });
    });
  }
});
