# 三阶段优化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构主页、新增 category/mode-pick 两页、重构完成页、优化 session 流畅度、打包 release。

**Architecture:** 页面流变为 home → category → mode-pick → session → complete。使用 Zepp OS 原生 widget + push()/replace() 导航。视觉复杂度放 PNG 生成器，页面代码保持简单。方屏/圆屏同时维护。

**Tech Stack:** Zepp OS v3.0.0, `@zos/ui` widget, `@zos/router` push/replace, `@zos/storage` LocalStorage, PowerShell 生成器 + ImageMagick, Node.js test runner.

---

## 文件结构

```
page/home/home.js              ← 重构：进度条 + 大类卡片 + START
page/home/home.r.layout.js     ← 重构：新布局样式
page/home/home.s.layout.js     ← 重构：新布局样式
page/category/category.js      ← 新增：运动项目列表
page/category/category.r.layout.js ← 新增
page/category/category.s.layout.js ← 新增
page/mode-pick/mode-pick.js    ← 新增：Quick/Full 选择
page/mode-pick/mode-pick.r.layout.js ← 新增
page/mode-pick/mode-pick.s.layout.js ← 新增
page/session/session.js        ← 修改：传递完整参数到 complete
page/complete/complete.js      ← 重构：总结卡
page/complete/complete.r.layout.js ← 重构
page/complete/complete.s.layout.js ← 重构
test/fitness-ui-contract.test.mjs ← 更新：匹配新主页/完成页
test/category-routing.test.mjs ← 新增
scripts/validate-assets.mjs    ← 可能新增 category icon 资产
```

---

### Task 1: 新增大类图标资产资源检查

**Files:**
- 检查: `assets/gt.r/cat_cardio.png`, `assets/gt.r/cat_strength.png`, `assets/gt.r/cat_ball.png`
- 检查: `assets/gt.s/cat_cardio.png`, `assets/gt.s/cat_strength.png`, `assets/gt.s/cat_ball.png`

- [ ] **Step 1: 验证大类图标已存在且尺寸正确**

```bash
# 检查圆屏
node -e "
const { readFileSync } = require('fs');
const path = 'D:/huami/zepp-stretch-coach/assets/gt.r';
for (const f of ['cat_cardio.png','cat_strength.png','cat_ball.png']) {
  const buf = readFileSync(path + '/' + f);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  console.log(f, w + 'x' + h);
}
"
```

Run: `bash`
Expected: `32x32` 或接近的尺寸（圆屏 CATEGORY_ICON_STYLE 是 32x32）

```bash
# 检查方屏
node -e "
const { readFileSync } = require('fs');
const path = 'D:/huami/zepp-stretch-coach/assets/gt.s';
for (const f of ['cat_cardio.png','cat_strength.png','cat_ball.png']) {
  const buf = readFileSync(path + '/' + f);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  console.log(f, w + 'x' + h);
}
"
```

Run: `bash`
Expected: `24x24`（方屏 CATEGORY_ICON_STYLE 是 24x24）

如果尺寸不对或缺少，需运行生成器：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\generate-assets.ps1 -BackgroundSource assets\gt.r\bg.png -IconSource assets\gt.r\icon.png
```

---

### Task 2: 重构主页布局样式 (r 圆屏)

**Files:**
- Modify: `page/home/home.r.layout.js`

- [ ] **Step 1: 替换圆屏主页布局样式**

直接 Write 替换整个文件：

```js
import { px } from "@zos/utils";
import { align } from "@zos/ui";

export const W = px(480);
export const H = px(480);

// 本周进度条
export const PROGRESS_LABEL_STYLE = {
  x: px(40),
  y: px(36),
  w: px(200),
  h: px(24),
  color: 0xffffff,
  text_size: px(16),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PROGRESS_VALUE_STYLE = {
  x: px(390),
  y: px(36),
  w: px(50),
  h: px(24),
  color: 0xb6f640,
  text_size: px(16),
  align_h: align.RIGHT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PROGRESS_BG_STYLE = {
  x: px(40),
  y: px(66),
  w: px(400),
  h: px(6),
  color: 0x1e251f
};

export const PROGRESS_FILL_STYLE = {
  x: px(40),
  y: px(66),
  w: px(268),
  h: px(6),
  color: 0xb6f640
};

// 大类卡片
export const CAT_CARD_STYLE = {
  x: px(40),
  y: 0,
  w: px(400),
  h: px(72)
};

export const CAT_ICON_STYLE = {
  x: px(56),
  y: 0,
  w: px(32),
  h: px(32)
};

export const CAT_NAME_STYLE = {
  x: px(100),
  y: 0,
  w: px(260),
  h: px(46),
  color: 0xffffff,
  text_size: px(20),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const CAT_SUB_STYLE = {
  x: px(100),
  y: px(38),
  w: px(260),
  h: px(24),
  color: 0x9aa497,
  text_size: px(15),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const CAT_ARROW_STYLE = {
  x: px(400),
  y: 0,
  w: px(24),
  h: px(72),
  color: 0xb6f640,
  text_size: px(22),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

// CAT_CARD 各卡片 Y 偏移
export const CAT1_Y = px(92);
export const CAT2_Y = px(172);
export const CAT3_Y = px(252);

// START 主按钮
export const START_BTN_STYLE = {
  x: px(40),
  y: px(340),
  w: px(400),
  h: px(60),
  src: "btn_start.png"
};

// 底部 GUIDE / VIBRATION
export const GUIDE_BTN_STYLE = {
  x: px(140),
  y: px(420),
  w: px(80),
  h: px(30),
  color: 0x6a7568,
  text_size: px(15),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const VIBRATION_BTN_STYLE = {
  x: px(260),
  y: px(420),
  w: px(80),
  h: px(30),
  color: 0x6a7568,
  text_size: px(15),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};
```

- [ ] **Step 2: 检查 layout 无裸数字对齐常量**

```bash
grep -n "align_h:" page/home/home.r.layout.js | grep -v "align\."
```

Run: `bash`
Expected: 无输出（所有对齐都用命名常量）

---

### Task 3: 重构主页布局样式 (s 方屏)

**Files:**
- Modify: `page/home/home.s.layout.js`

- [ ] **Step 1: 替换方屏主页布局样式**

```js
import { px } from "@zos/utils";
import { align, setStatusBarVisible } from "@zos/ui";

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const PROGRESS_LABEL_STYLE = {
  x: px(20),
  y: px(20),
  w: px(180),
  h: px(22),
  color: 0xffffff,
  text_size: px(14),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PROGRESS_VALUE_STYLE = {
  x: px(320),
  y: px(20),
  w: px(50),
  h: px(22),
  color: 0xb6f640,
  text_size: px(14),
  align_h: align.RIGHT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PROGRESS_BG_STYLE = {
  x: px(20),
  y: px(48),
  w: px(350),
  h: px(5),
  color: 0x1e251f
};

export const PROGRESS_FILL_STYLE = {
  x: px(20),
  y: px(48),
  w: px(235),
  h: px(5),
  color: 0xb6f640
};

export const CAT_CARD_STYLE = {
  x: px(20),
  y: 0,
  w: px(350),
  h: px(64)
};

export const CAT_ICON_STYLE = {
  x: px(32),
  y: 0,
  w: px(24),
  h: px(24)
};

export const CAT_NAME_STYLE = {
  x: px(68),
  y: 0,
  w: px(230),
  h: px(40),
  color: 0xffffff,
  text_size: px(18),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const CAT_SUB_STYLE = {
  x: px(68),
  y: px(32),
  w: px(230),
  h: px(22),
  color: 0x9aa497,
  text_size: px(13),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const CAT_ARROW_STYLE = {
  x: px(346),
  y: 0,
  w: px(20),
  h: px(64),
  color: 0xb6f640,
  text_size: px(20),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const CAT1_Y = px(68);
export const CAT2_Y = px(140);
export const CAT3_Y = px(212);

export const START_BTN_STYLE = {
  x: px(20),
  y: px(288),
  w: px(350),
  h: px(55),
  src: "btn_start.png"
};

export const GUIDE_BTN_STYLE = {
  x: px(115),
  y: px(360),
  w: px(70),
  h: px(28),
  color: 0x6a7568,
  text_size: px(13),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const VIBRATION_BTN_STYLE = {
  x: px(205),
  y: px(360),
  w: px(70),
  h: px(28),
  color: 0x6a7568,
  text_size: px(13),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};
```

---

### Task 4: 重构主页 JS 逻辑

**Files:**
- Modify: `page/home/home.js`

- [ ] **Step 1: 替换 home.js**

```js
import { createWidget, widget, event } from "@zos/ui";
import * as Styles from "zosLoader:./home.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { push } from "@zos/router";
import { Storage } from "../../services/storage";
import { CATEGORIES } from "../../data/categories";

Page({
  state: {
    completionCount: 0,
    weeklyGoal: 3
  },

  onInit() {
    Storage.migrate();
  },

  build() {
    this.completionCount = Storage.get(Storage.KEYS.COMPLETION_COUNT, 0);
    const weeklyGoal = this.weeklyGoal;
    const completedForGoal = Math.min(this.completionCount, weeklyGoal);
    const pctWidth = completedForGoal === 0
      ? 0
      : Math.round((completedForGoal / weeklyGoal) * pxNum(Styles.PROGRESS_BG_STYLE.w));

    const group = createWidget(widget.GROUP, Common.SCREEN_STYLE);

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    // 本周进度条
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
        ...Styles.PROGRESS_FILL_STYLE,
        w: pctWidth
      });
    }

    // 三大类卡片
    this._buildCategoryCard(group, CATEGORIES[0], Styles.CAT1_Y);
    this._buildCategoryCard(group, CATEGORIES[1], Styles.CAT2_Y);
    this._buildCategoryCard(group, CATEGORIES[2], Styles.CAT3_Y);

    // START 按钮
    const btnStart = group.createWidget(widget.IMG, Styles.START_BTN_STYLE);
    btnStart.addEventListener(event.CLICK_UP, () => {
      // 跳转到最近训练的运动项目的 Quick/Full 页
      // 若无历史则进入第一个大类
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

    // 底部 GUIDE
    const btnGuide = group.createWidget(widget.TEXT, {
      ...Styles.GUIDE_BTN_STYLE,
      text: "指南"
    });
    btnGuide.addEventListener(event.CLICK_UP, () => {
      push({ url: "/page/safety/safety" });
    });

    // 底部 VIBRATION
    const btnVib = group.createWidget(widget.TEXT, {
      ...Styles.VIBRATION_BTN_STYLE,
      text: "震动"
    });
    btnVib.addEventListener(event.CLICK_UP, () => {
      push({ url: "/page/settings/settings" });
    });
  },

  _buildCategoryCard(group, cat, y) {
    const cardGroup = group.createWidget(widget.GROUP, {
      x: Styles.CAT_CARD_STYLE.x,
      y: y,
      w: Styles.CAT_CARD_STYLE.w,
      h: Styles.CAT_CARD_STYLE.h
    });

    // 卡片背景
    cardGroup.createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: Styles.CAT_CARD_STYLE.w,
      h: Styles.CAT_CARD_STYLE.h,
      color: 0x141a15,
      alpha: 220
    });

    // 图标
    cardGroup.createWidget(widget.IMG, {
      x: Styles.CAT_ICON_STYLE.x - Styles.CAT_CARD_STYLE.x,
      y: (Styles.CAT_CARD_STYLE.h - Styles.CAT_ICON_STYLE.h) / 2,
      w: Styles.CAT_ICON_STYLE.w,
      h: Styles.CAT_ICON_STYLE.h,
      src: `${cat.icon}.png`
    });

    // 名称
    cardGroup.createWidget(widget.TEXT, {
      x: Styles.CAT_NAME_STYLE.x - Styles.CAT_CARD_STYLE.x,
      y: 0,
      w: Styles.CAT_NAME_STYLE.w,
      h: Styles.CAT_CARD_STYLE.h / 2 + 4,
      color: Styles.CAT_NAME_STYLE.color,
      text_size: Styles.CAT_NAME_STYLE.text_size,
      align_h: Styles.CAT_NAME_STYLE.align_h,
      align_v: Styles.CAT_NAME_STYLE.align_v,
      text_style: 0,
      text: cat.name
    });

    // 子项数量
    const { SPORTS } = require("../../data/sports");
    const count = SPORTS.filter(s => s.categoryId === cat.id).length;
    cardGroup.createWidget(widget.TEXT, {
      x: Styles.CAT_SUB_STYLE.x - Styles.CAT_CARD_STYLE.x,
      y: Styles.CAT_CARD_STYLE.h / 2 - 4,
      w: Styles.CAT_SUB_STYLE.w,
      h: Styles.CAT_SUB_STYLE.h,
      color: Styles.CAT_SUB_STYLE.color,
      text_size: Styles.CAT_SUB_STYLE.text_size,
      align_h: Styles.CAT_SUB_STYLE.align_h,
      align_v: Styles.CAT_SUB_STYLE.align_v,
      text_style: 0,
      text: `${count} 个拉伸方案`
    });

    // 箭头
    cardGroup.createWidget(widget.TEXT, {
      x: Styles.CAT_ARROW_STYLE.x - Styles.CAT_CARD_STYLE.x,
      y: 0,
      w: Styles.CAT_ARROW_STYLE.w,
      h: Styles.CAT_CARD_STYLE.h,
      color: Styles.CAT_ARROW_STYLE.color,
      text_size: Styles.CAT_ARROW_STYLE.text_size,
      align_h: Styles.CAT_ARROW_STYLE.align_h,
      align_v: Styles.CAT_ARROW_STYLE.align_v,
      text_style: 0,
      text: ">"
    });

    // 点击目标 — 透明热区覆盖整张卡片
    const hitTarget = cardGroup.createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: Styles.CAT_CARD_STYLE.w,
      h: Styles.CAT_CARD_STYLE.h,
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

function pxNum(val) {
  return val;
}
```

- [ ] **Step 2: 修正：将 require 改为顶层 import**

上面 `_buildCategoryCard` 中的 `require("../../data/sports")` 不能在运行时使用。改为在 `build()` 中预先计算好 count：

在 `build()` 顶部加入：
```js
const { SPORTS } = require("../../data/sports");
```
→ 但 Zepp OS 不支持 require。改用 import：

实际上在 home.js 顶层改为：将 count 作为参数从 build() 传入 `_buildCategoryCard`。

完整修正：在 build() 中：

```js
import { SPORTS } from "../../data/sports";
// ... 在 build 内:
const sportCounts = {};
for (const cat of CATEGORIES) {
  sportCounts[cat.id] = SPORTS.filter(s => s.categoryId === cat.id).length;
}
// 然后 _buildCategoryCard(group, cat, y, sportCounts[cat.id])
```

- [ ] **Step 3: 修正后的 home.js 完整版**

Write 替换 `page/home/home.js`：

```js
import { createWidget, widget, event } from "@zos/ui";
import * as Styles from "zosLoader:./home.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { push } from "@zos/router";
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
  },

  build() {
    this.completionCount = Storage.get(Storage.KEYS.COMPLETION_COUNT, 0);
    const weeklyGoal = this.weeklyGoal;
    const completedForGoal = Math.min(this.completionCount, weeklyGoal);
    const barW = Styles.PROGRESS_BG_STYLE.w;
    const pctWidth = completedForGoal === 0 ? 0 : Math.round((completedForGoal / weeklyGoal) * barW);

    // 预计算每类 sport 数量
    const sportCounts = {};
    for (const cat of CATEGORIES) {
      sportCounts[cat.id] = SPORTS.filter(s => s.categoryId === cat.id).length;
    }

    const group = createWidget(widget.GROUP, Common.SCREEN_STYLE);

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    // 本周进度条
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
        ...Styles.PROGRESS_BG_STYLE,
        h: Styles.PROGRESS_FILL_STYLE ? Styles.PROGRESS_FILL_STYLE.h : Styles.PROGRESS_BG_STYLE.h,
        w: pctWidth,
        color: 0xb6f640
      });
    }

    // 三大类卡片
    const catYs = [Styles.CAT1_Y, Styles.CAT2_Y, Styles.CAT3_Y];
    for (let i = 0; i < CATEGORIES.length; i++) {
      this._buildCategoryCard(group, CATEGORIES[i], catYs[i], sportCounts[CATEGORIES[i].id]);
    }

    // START 按钮
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

    // 底部 GUIDE
    const btnGuide = group.createWidget(widget.TEXT, {
      ...Styles.GUIDE_BTN_STYLE,
      text: "指南"
    });
    btnGuide.addEventListener(event.CLICK_UP, () => {
      push({ url: "/page/safety/safety" });
    });

    // 底部 VIBRATION
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

    // 卡片背景
    const bg = group.createWidget(widget.FILL_RECT, {
      x: cardX,
      y: y,
      w: cardW,
      h: cardH,
      color: 0x141a15,
      alpha: 220
    });

    // 图标
    group.createWidget(widget.IMG, {
      x: cardX + pxNum(16),
      y: y + Math.floor((cardH - Styles.CAT_ICON_STYLE.h) / 2),
      w: Styles.CAT_ICON_STYLE.w,
      h: Styles.CAT_ICON_STYLE.h,
      src: `${cat.icon}.png`
    });

    // 名称
    group.createWidget(widget.TEXT, {
      x: cardX + pxNum(60),
      y: y + pxNum(8),
      w: cardW - pxNum(100),
      h: pxNum(24),
      color: 0xffffff,
      text_size: Styles.CAT_NAME_STYLE.text_size,
      align_h: Styles.CAT_NAME_STYLE.align_h,
      align_v: Styles.CAT_NAME_STYLE.align_v,
      text_style: 0,
      text: cat.name
    });

    // 子项数量
    group.createWidget(widget.TEXT, {
      x: cardX + pxNum(60),
      y: y + pxNum(34),
      w: cardW - pxNum(100),
      h: pxNum(22),
      color: 0x9aa497,
      text_size: Styles.CAT_SUB_STYLE.text_size,
      align_h: Styles.CAT_SUB_STYLE.align_h,
      align_v: Styles.CAT_SUB_STYLE.align_v,
      text_style: 0,
      text: `${subCount} 个拉伸方案`
    });

    // 箭头
    group.createWidget(widget.TEXT, {
      x: cardX + cardW - pxNum(40),
      y: y,
      w: pxNum(24),
      h: cardH,
      color: 0xb6f640,
      text_size: pxNum(22),
      align_h: Styles.CAT_ARROW_STYLE.align_h,
      align_v: Styles.CAT_ARROW_STYLE.align_v,
      text_style: 0,
      text: ">"
    });

    // 透明热区
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

function pxNum(val) {
  return val;
}
```

- [ ] **Step 4: 运行验证**

```powershell
npm.cmd run verify
```

若 layout-alignment 测试检查 home 页布局值，需要确认测试适配新布局。

---

### Task 5: 新增 category 页布局 (圆屏)

**Files:**
- Create: `page/category/category.r.layout.js`

- [ ] **Step 1: 写入圆屏 layout**

```js
import { px } from "@zos/utils";
import { align } from "@zos/ui";

export const W = px(480);
export const H = px(480);

export const BACK_AREA_STYLE = {
  x: px(0),
  y: px(36),
  w: px(120),
  h: px(40)
};

export const BACK_ARROW_STYLE = {
  x: px(36),
  y: px(42),
  w: px(24),
  h: px(28),
  color: 0xb6f640,
  text_size: px(24),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const TITLE_STYLE = {
  x: px(80),
  y: px(38),
  w: px(360),
  h: px(36),
  color: 0xffffff,
  text_size: px(22),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const LIST_START_Y = px(90);
export const LIST_ITEM_H = px(72);
export const BOTTOM_PADDING = px(24);

export const ROW_CARD_STYLE = {
  x: px(40),
  y: 0,
  w: px(400),
  h: px(64)
};

export const SPORT_ICON_STYLE = {
  x: px(56),
  y: 0,
  w: px(42),
  h: px(42)
};

export const ITEM_TEXT_STYLE = {
  x: px(120),
  y: px(4),
  w: px(240),
  h: px(34),
  color: 0xffffff,
  text_size: px(20),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const ITEM_SUB_STYLE = {
  x: px(120),
  y: px(36),
  w: px(240),
  h: px(26),
  color: 0x9aa497,
  text_size: px(16),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const ITEM_ARROW_STYLE = {
  x: px(420),
  y: 0,
  w: px(24),
  h: px(64),
  color: 0xb6f640,
  text_size: px(22),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};
```

---

### Task 6: 新增 category 页布局 (方屏)

**Files:**
- Create: `page/category/category.s.layout.js`

- [ ] **Step 1: 写入方屏 layout**

```js
import { px } from "@zos/utils";
import { align, setStatusBarVisible } from "@zos/ui";

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const BACK_AREA_STYLE = {
  x: px(0),
  y: px(18),
  w: px(100),
  h: px(36)
};

export const BACK_ARROW_STYLE = {
  x: px(22),
  y: px(22),
  w: px(22),
  h: px(26),
  color: 0xb6f640,
  text_size: px(22),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const TITLE_STYLE = {
  x: px(58),
  y: px(20),
  w: px(310),
  h: px(32),
  color: 0xffffff,
  text_size: px(20),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const LIST_START_Y = px(66);
export const LIST_ITEM_H = px(68);
export const BOTTOM_PADDING = px(20);

export const ROW_CARD_STYLE = {
  x: px(20),
  y: 0,
  w: px(350),
  h: px(60)
};

export const SPORT_ICON_STYLE = {
  x: px(32),
  y: 0,
  w: px(38),
  h: px(38)
};

export const ITEM_TEXT_STYLE = {
  x: px(90),
  y: px(2),
  w: px(200),
  h: px(32),
  color: 0xffffff,
  text_size: px(18),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const ITEM_SUB_STYLE = {
  x: px(90),
  y: px(32),
  w: px(200),
  h: px(24),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const ITEM_ARROW_STYLE = {
  x: px(346),
  y: 0,
  w: px(20),
  h: px(60),
  color: 0xb6f640,
  text_size: px(20),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};
```

---

### Task 7: 新增 category 页 JS 逻辑

**Files:**
- Create: `page/category/category.js`

- [ ] **Step 1: 写入 category.js**

```js
import { createWidget, widget, event } from "@zos/ui";
import * as Styles from "zosLoader:./category.[pf].layout.js";
import * as Common from "zosLoader:./../common.[pf].layout.js";
import { push, back } from "@zos/router";
import { setScrollMode, SCROLL_MODE_FREE } from "@zos/page";
import { getSportsByCategory, getSport } from "../../data/sports";
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

    group.createWidget(widget.FILL_RECT, {
      x: px(0),
      y: px(0),
      w: Styles.W,
      h: contentH,
      color: 0x050806
    });

    group.createWidget(widget.IMG, {
      ...Common.SCREEN_STYLE,
      src: "bg.png"
    });

    // 返回导航
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
      text: title
    });

    // 运动项目列表
    let yOffset = Styles.LIST_START_Y;

    for (const sport of this.sports) {
      const itemY = yOffset;
      const onSelect = () => {
        this._selectSport(sport.id);
      };

      // 暗色行卡背景
      group.createWidget(widget.FILL_RECT, {
        x: Styles.ROW_CARD_STYLE.x,
        y: itemY,
        w: Styles.ROW_CARD_STYLE.w,
        h: Styles.ROW_CARD_STYLE.h,
        color: 0x141a15,
        alpha: 220
      });

      // 运动图标
      group.createWidget(widget.IMG, {
        x: Styles.SPORT_ICON_STYLE.x,
        y: itemY + Math.floor((Styles.ROW_CARD_STYLE.h - Styles.SPORT_ICON_STYLE.h) / 2),
        w: Styles.SPORT_ICON_STYLE.w,
        h: Styles.SPORT_ICON_STYLE.h,
        src: `${sport.icon}.png`
      });

      // 名称
      group.createWidget(widget.TEXT, {
        ...Styles.ITEM_TEXT_STYLE,
        y: itemY + Styles.ITEM_TEXT_STYLE.y,
        text: sport.shortName || sport.name
      });

      // 预计时长
      const routine = recommendRoutine(sport.id, undefined, { routineType: "quick" });
      const dur = routine ? estimateDuration(routine.steps) : 0;
      const durStr = dur > 0 ? `~${Math.ceil(dur / 60)} min` : "";

      group.createWidget(widget.TEXT, {
        ...Styles.ITEM_SUB_STYLE,
        y: itemY + Styles.ITEM_SUB_STYLE.y,
        text: durStr ? `${durStr} · Quick` : ""
      });

      // 箭头
      group.createWidget(widget.TEXT, {
        ...Styles.ITEM_ARROW_STYLE,
        y: itemY,
        text: ">"
      });

      // 透明热区
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
```

- [ ] **Step 2: 验证 category 页无裸数字对齐常量**

```bash
grep -n "align_h:" page/category/category.r.layout.js page/category/category.s.layout.js | grep -v "align\."
```

Run: `bash`
Expected: 无输出

---

### Task 8: 新增 mode-pick 页布局 (圆屏)

**Files:**
- Create: `page/mode-pick/mode-pick.r.layout.js`

- [ ] **Step 1: 写入圆屏 layout**

```js
import { px } from "@zos/utils";
import { align } from "@zos/ui";

export const W = px(480);
export const H = px(480);

export const BACK_AREA_STYLE = {
  x: px(0),
  y: px(36),
  w: px(120),
  h: px(40)
};

export const BACK_ARROW_STYLE = {
  x: px(36),
  y: px(42),
  w: px(24),
  h: px(28),
  color: 0xb6f640,
  text_size: px(24),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const TITLE_STYLE = {
  x: px(80),
  y: px(38),
  w: px(360),
  h: px(36),
  color: 0xffffff,
  text_size: px(22),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const MODE_CARD_STYLE = {
  x: px(60),
  y: 0,
  w: px(360),
  h: px(80)
};

export const MODE_ICON_STYLE = {
  x: px(86),
  y: 0,
  w: px(40),
  h: px(40)
};

export const MODE_NAME_STYLE = {
  x: px(140),
  y: px(8),
  w: px(220),
  h: px(34),
  color: 0xffffff,
  text_size: px(22),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const MODE_DESC_STYLE = {
  x: px(140),
  y: px(44),
  w: px(220),
  h: px(26),
  color: 0x9aa497,
  text_size: px(16),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const MODE_ARROW_STYLE = {
  x: px(420),
  y: 0,
  w: px(24),
  h: px(80),
  color: 0xb6f640,
  text_size: px(22),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const QUICK_Y = px(100);
export const FULL_Y = px(196);
```

---

### Task 9: 新增 mode-pick 页布局 (方屏)

**Files:**
- Create: `page/mode-pick/mode-pick.s.layout.js`

- [ ] **Step 1: 写入方屏 layout**

```js
import { px } from "@zos/utils";
import { align, setStatusBarVisible } from "@zos/ui";

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const BACK_AREA_STYLE = {
  x: px(0),
  y: px(18),
  w: px(100),
  h: px(36)
};

export const BACK_ARROW_STYLE = {
  x: px(22),
  y: px(22),
  w: px(22),
  h: px(26),
  color: 0xb6f640,
  text_size: px(22),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const TITLE_STYLE = {
  x: px(58),
  y: px(20),
  w: px(310),
  h: px(32),
  color: 0xffffff,
  text_size: px(20),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const MODE_CARD_STYLE = {
  x: px(30),
  y: 0,
  w: px(330),
  h: px(72)
};

export const MODE_ICON_STYLE = {
  x: px(50),
  y: 0,
  w: px(36),
  h: px(36)
};

export const MODE_NAME_STYLE = {
  x: px(100),
  y: px(6),
  w: px(200),
  h: px(30),
  color: 0xffffff,
  text_size: px(20),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const MODE_DESC_STYLE = {
  x: px(100),
  y: px(40),
  w: px(200),
  h: px(24),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const MODE_ARROW_STYLE = {
  x: px(346),
  y: 0,
  w: px(20),
  h: px(72),
  color: 0xb6f640,
  text_size: px(20),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const QUICK_Y = px(82);
export const FULL_Y = px(170);
```

---

### Task 10: 新增 mode-pick 页 JS 逻辑

**Files:**
- Create: `page/mode-pick/mode-pick.js`

- [ ] **Step 1: 写入 mode-pick.js**

```js
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

    // 返回导航
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

    // Quick 卡片
    this._buildModeCard(group, "quick", "Quick", "核心拉伸", Styles.QUICK_Y);

    // Full 卡片
    this._buildModeCard(group, "full", "Full", "完整拉伸", Styles.FULL_Y);
  },

  _buildModeCard(group, type, label, tag, cardY) {
    const sport = getSport(this.sportId);
    const routine = recommendRoutine(this.sportId, undefined, { routineType: type });
    const dur = routine ? estimateDuration(routine.steps) : 0;
    const durStr = dur > 0 ? `~${Math.ceil(dur / 60)} 分钟` : "";

    const cardX = Styles.MODE_CARD_STYLE.x;
    const cardW = Styles.MODE_CARD_STYLE.w;
    const cardH = Styles.MODE_CARD_STYLE.h;
    const MARGIN = 16;

    // 暗色卡片背景
    group.createWidget(widget.FILL_RECT, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      color: 0x141a15,
      alpha: 220
    });

    // 模式名称
    group.createWidget(widget.TEXT, {
      x: cardX + MARGIN + 52,
      y: cardY + pxNum(12),
      w: cardW - MARGIN * 2 - 80,
      h: pxNum(28),
      color: 0xffffff,
      text_size: Styles.MODE_NAME_STYLE.text_size,
      align_h: Styles.MODE_NAME_STYLE.align_h,
      align_v: Styles.MODE_NAME_STYLE.align_v,
      text_style: 0,
      text: label
    });

    // 描述
    group.createWidget(widget.TEXT, {
      x: cardX + MARGIN + 52,
      y: cardY + pxNum(44),
      w: cardW - MARGIN * 2 - 80,
      h: pxNum(24),
      color: 0x9aa497,
      text_size: Styles.MODE_DESC_STYLE.text_size,
      align_h: Styles.MODE_DESC_STYLE.align_h,
      align_v: Styles.MODE_DESC_STYLE.align_v,
      text_style: 0,
      text: durStr ? `${durStr} · ${tag}` : tag
    });

    // 箭头
    group.createWidget(widget.TEXT, {
      x: cardX + cardW - pxNum(40),
      y: cardY,
      w: pxNum(24),
      h: cardH,
      color: 0xb6f640,
      text_size: pxNum(22),
      align_h: Styles.MODE_ARROW_STYLE.align_h,
      align_v: Styles.MODE_ARROW_STYLE.align_v,
      text_style: 0,
      text: ">"
    });

    // 透明热区
    const hitTarget = group.createWidget(widget.FILL_RECT, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      color: 0x000000,
      alpha: 0
    });
    hitTarget.addEventListener(event.CLICK_UP, () => {
      // 记住最近训练的运动
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

function pxNum(val) {
  return val;
}
```

---

### Task 11: 修改 session.js 传递完整参数到 complete

**Files:**
- Modify: `page/session/session.js:190-213`

- [ ] **Step 1: 修改 _onComplete 方法**

在 `_onComplete` 中找到 `replace({ url: "/page/complete/complete", ... })` 调用，添加额外参数：

当前代码（约 L204-212）：

```js
this.state.completionNavTimer = setTimeout(() => {
  replace({
    url: "/page/complete/complete",
    params: {
      completed: info.completed,
      reason: info.reason
    }
  });
}, info.completed ? 1250 : 0);
```

改为：

```js
this.state.completionNavTimer = setTimeout(() => {
  const totalSteps = this.state.machine.steps.length;
  const totalDuration = this._computeTotalDuration();

  replace({
    url: "/page/complete/complete",
    params: JSON.stringify({
      completed: info.completed,
      reason: info.reason,
      sportId: this._sportId || "",
      routineType: this._routineType || "quick",
      totalSteps: totalSteps,
      totalDuration: totalDuration
    })
  });
}, info.completed ? 1250 : 0);
```

- [ ] **Step 2: 在 onInit 中保存 sportId 和 routineType**

在 `onInit` 方法中增加：

```js
const params = JSON.parse(options || "{}");
const sportId = params.sportId || "run-outdoor";
const routineType = params.routineType || "quick";
this._sportId = sportId;
this._routineType = routineType;
```

- [ ] **Step 3: 新增 _computeTotalDuration 辅助方法**

在 session.js 末尾（`onDestroy` 之前）添加：

```js
_computeTotalDuration() {
  let total = 0;
  for (const step of this.state.machine.steps) {
    const dur = step.duration || 30;
    if (step.side === "single") {
      total += 3 + dur + 3 + dur; // prepare + left + switch + right
    } else {
      total += 3 + dur; // prepare + exercise
    }
  }
  return total;
},
```

---

### Task 12: 重构 complete 页布局 (圆屏)

**Files:**
- Modify: `page/complete/complete.r.layout.js`

- [ ] **Step 1: 替换圆屏 complete layout**

```js
import { px } from "@zos/utils";
import { align } from "@zos/ui";

export const W = px(480);
export const H = px(480);

export const TITLE_STYLE = {
  x: px(40),
  y: px(48),
  w: px(400),
  h: px(48),
  color: 0xffffff,
  text_size: px(32),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUBTITLE_STYLE = {
  x: px(40),
  y: px(96),
  w: px(400),
  h: px(24),
  color: 0x9aa497,
  text_size: px(16),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const STATUS_STYLE = {
  x: px(40),
  y: px(122),
  w: px(400),
  h: px(22),
  color: 0x6febae,
  text_size: px(15),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

// 总结卡
export const SUMMARY_CARD_STYLE = {
  x: px(60),
  y: px(166),
  w: px(360),
  h: px(110)
};

export const SUMMARY_VALUE_1_STYLE = {
  x: px(80),
  y: px(184),
  w: px(100),
  h: px(34),
  color: 0xffffff,
  text_size: px(26),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_LABEL_1_STYLE = {
  x: px(80),
  y: px(218),
  w: px(100),
  h: px(22),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_VALUE_2_STYLE = {
  x: px(190),
  y: px(184),
  w: px(100),
  h: px(34),
  color: 0x6febae,
  text_size: px(26),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_LABEL_2_STYLE = {
  x: px(190),
  y: px(218),
  w: px(100),
  h: px(22),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_VALUE_3_STYLE = {
  x: px(300),
  y: px(184),
  w: px(100),
  h: px(34),
  color: 0xb6f640,
  text_size: px(26),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_LABEL_3_STYLE = {
  x: px(300),
  y: px(218),
  w: px(100),
  h: px(22),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const HOME_BTN_STYLE = {
  x: px(60),
  y: px(310),
  w: px(360),
  h: px(55),
  src: "btn_home.png"
};
```

---

### Task 13: 重构 complete 页布局 (方屏)

**Files:**
- Modify: `page/complete/complete.s.layout.js`

- [ ] **Step 1: 替换方屏 complete layout**

```js
import { px } from "@zos/utils";
import { align, setStatusBarVisible } from "@zos/ui";

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const TITLE_STYLE = {
  x: px(20),
  y: px(32),
  w: px(350),
  h: px(42),
  color: 0xffffff,
  text_size: px(28),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUBTITLE_STYLE = {
  x: px(20),
  y: px(72),
  w: px(350),
  h: px(22),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const STATUS_STYLE = {
  x: px(20),
  y: px(96),
  w: px(350),
  h: px(20),
  color: 0x6febae,
  text_size: px(13),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_CARD_STYLE = {
  x: px(30),
  y: px(134),
  w: px(330),
  h: px(100)
};

export const SUMMARY_VALUE_1_STYLE = {
  x: px(45),
  y: px(152),
  w: px(90),
  h: px(30),
  color: 0xffffff,
  text_size: px(24),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_LABEL_1_STYLE = {
  x: px(45),
  y: px(182),
  w: px(90),
  h: px(20),
  color: 0x9aa497,
  text_size: px(12),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_VALUE_2_STYLE = {
  x: px(150),
  y: px(152),
  w: px(90),
  h: px(30),
  color: 0x6febae,
  text_size: px(24),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_LABEL_2_STYLE = {
  x: px(150),
  y: px(182),
  w: px(90),
  h: px(20),
  color: 0x9aa497,
  text_size: px(12),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_VALUE_3_STYLE = {
  x: px(255),
  y: px(152),
  w: px(90),
  h: px(30),
  color: 0xb6f640,
  text_size: px(24),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_LABEL_3_STYLE = {
  x: px(255),
  y: px(182),
  w: px(90),
  h: px(20),
  color: 0x9aa497,
  text_size: px(12),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const HOME_BTN_STYLE = {
  x: px(30),
  y: px(264),
  w: px(330),
  h: px(50),
  src: "btn_home.png"
};
```

---

### Task 14: 重构 complete 页 JS 逻辑

**Files:**
- Modify: `page/complete/complete.js`

- [ ] **Step 1: 替换 complete.js**

```js
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

    // 标题
    group.createWidget(widget.TEXT, {
      ...Styles.TITLE_STYLE,
      text: this.completed ? "Great job!" : "早退了"
    });

    // 副标题：运动 + 模式
    const sport = getSport(this.sportId);
    const sportName = sport ? (sport.shortName || sport.name) : "";
    const modeLabel = this.routineType === "quick" ? "Quick" : "Full";
    group.createWidget(widget.TEXT, {
      ...Styles.SUBTITLE_STYLE,
      text: sportName ? `${sportName} · ${modeLabel}` : ""
    });

    // 状态
    group.createWidget(widget.TEXT, {
      ...Styles.STATUS_STYLE,
      text: this.completed ? "所有拉伸已完成" : "训练提前结束"
    });

    // 总结卡底色
    group.createWidget(widget.FILL_RECT, {
      ...Styles.SUMMARY_CARD_STYLE,
      color: 0x141a15,
      alpha: 220
    });

    // 动作数
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_VALUE_1_STYLE,
      text: `${this.totalSteps}`
    });
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_LABEL_1_STYLE,
      text: "动作"
    });

    // 时长
    const min = this.totalDuration > 0 ? Math.ceil(this.totalDuration / 60) : 0;
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_VALUE_2_STYLE,
      text: `~${min} min`
    });
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_LABEL_2_STYLE,
      text: "时长"
    });

    // 本周进度
    const count = Storage.get(Storage.KEYS.COMPLETION_COUNT, 0);
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_VALUE_3_STYLE,
      text: `${count}/3`
    });
    group.createWidget(widget.TEXT, {
      ...Styles.SUMMARY_LABEL_3_STYLE,
      text: "本周"
    });

    // HOME 按钮
    const btnHome = group.createWidget(widget.IMG, Styles.HOME_BTN_STYLE);
    btnHome.addEventListener(event.CLICK_UP, () => {
      replace({ url: "/page/home/home" });
    });
  }
});
```

- [ ] **Step 2: 删除 ICON_STYLE 和 MESSAGE_STYLE 引用**

确认 complete.js 不再引用 `Styles.ICON_STYLE` 和 `Styles.MESSAGE_STYLE`。Summary 卡片用纯 widget 展示。

---

### Task 15: 重生成 START 按钮为绿色

**Files:**
- 检查: `scripts/generate-assets.ps1` 中的 `Draw-FitnessButton` 函数

START 按钮必须使用绿色主色调。当前 `btn_start.png` 已经是绿色 primary 按钮（从 fitness-ui-contract 测试可以确认）。验证即可，不需要改生成器。

- [ ] **Step 1: 验证 START 按钮已是绿色**

```bash
grep -n "btn_start" scripts/generate-assets.ps1
```

Run: `bash`
Expected: 输出包含 `"START" "primary"`（绿色主按钮）

---

### Task 16: 更新 fitness-ui-contract 测试

**Files:**
- Modify: `test/fitness-ui-contract.test.mjs`

- [ ] **Step 1: 更新主页测试**

将 `"uses a generated quiet fitness background"` 测试保留。

将原来的按钮测试 `"uses primary and secondary fitness buttons"` 改为验证新主页组件：

```js
it("home page shows progress bar and three large category cards with a green START button", () => {
  const home = read("page/home/home.js");
  const homeR = read("page/home/home.r.layout.js");
  const homeS = read("page/home/home.s.layout.js");

  // 进度条存在于 layout
  assert.match(homeR, /PROGRESS_LABEL_STYLE/);
  assert.match(homeR, /PROGRESS_VALUE_STYLE/);
  assert.match(homeR, /PROGRESS_BG_STYLE/);
  assert.match(homeR, /PROGRESS_FILL_STYLE/);
  assert.match(homeS, /PROGRESS_LABEL_STYLE/);

  // 三大类卡片样式
  assert.match(homeR, /CAT_CARD_STYLE/);
  assert.match(homeR, /CAT_NAME_STYLE/);
  assert.match(homeR, /CAT_SUB_STYLE/);
  assert.match(homeR, /CAT_ARROW_STYLE/);
  assert.match(homeR, /CAT1_Y/);
  assert.match(homeR, /CAT2_Y/);
  assert.match(homeR, /CAT3_Y/);

  // START 按钮
  assert.match(homeR, /START_BTN_STYLE/);
  assert.match(homeS, /START_BTN_STYLE/);

  // 底部 GUIDE / VIBRATION
  assert.match(homeR, /GUIDE_BTN_STYLE/);
  assert.match(homeR, /VIBRATION_BTN_STYLE/);

  // JS 中引用 category 页面导航
  assert.match(home, /page\/category\/category/);

  // 大类卡片使用 CATEGORIES 数据
  assert.match(home, /CATEGORIES/);
});
```

- [ ] **Step 2: 删除旧卡片测试**

删除原来的 data cards 测试 `"adds Apple Fitness-style data cards to the home screen"`——新设计不用 card_progress.png / card_trend.png。

- [ ] **Step 3: 更新 complete 页测试**

新增：

```js
it("complete page shows summary card with steps, duration, and weekly progress", () => {
  const complete = read("page/complete/complete.js");
  const completeR = read("page/complete/complete.r.layout.js");

  assert.match(completeR, /SUMMARY_CARD_STYLE/);
  assert.match(completeR, /SUMMARY_VALUE_1_STYLE/);
  assert.match(completeR, /SUMMARY_VALUE_2_STYLE/);
  assert.match(completeR, /SUMMARY_VALUE_3_STYLE/);

  // 引用 Storage 获取本周进度
  assert.match(complete, /COMPLETION_COUNT/);

  // 不再有独立 ICON
  assert.doesNotMatch(completeR, /ICON_STYLE/);
});
```

- [ ] **Step 4: 删除旧的 "keeps the home hierarchy airy" 测试**（该测试检查 TITLE/SUBTITLE/CARD/BTN 间距——新布局间距方案不同，需重写）

替换为：

```js
it("home layout elements do not overlap on round screen", () => {
  const layout = read("page/home/home.r.layout.js");
  const titleH = pxValue(layout, "PROGRESS_LABEL_STYLE", "h");
  const progressY = pxValue(layout, "PROGRESS_LABEL_STYLE", "y");
  const progressBottom = progressY + titleH;
  const cat1Y = pxValue(layout, "CAT1_Y");
  const cat3Y = pxValue(layout, "CAT3_Y");
  const catCardH = pxValue(layout, "CAT_CARD_STYLE", "h");
  const cat3Bottom = cat3Y + catCardH;
  const startY = pxValue(layout, "START_BTN_STYLE", "y");
  const startBottom = startY + pxValue(layout, "START_BTN_STYLE", "h");
  const guideY = pxValue(layout, "GUIDE_BTN_STYLE", "y");
  const guideBottom = guideY + pxValue(layout, "GUIDE_BTN_STYLE", "h");
  const screenH = pxValue(layout, "H");

  assert.ok(cat1Y - progressBottom >= 8, `progress-to-category gap too small: ${cat1Y - progressBottom}px`);
  assert.ok(startY - cat3Bottom >= 16, `category-to-start gap too small: ${startY - cat3Bottom}px`);
  assert.ok(guideY - startBottom >= 8, `start-to-guide gap too small: ${guideY - startBottom}px`);
  assert.ok(guideBottom < screenH, `guide bottom ${guideBottom} exceeds screen ${screenH}`);
});
```

- [ ] **Step 5: 保留 "removes the old loud orange UI accent" 测试**

不变，继续检查旧橙色不被使用。

---

### Task 17: 新增 category-routing 测试

**Files:**
- Create: `test/category-routing.test.mjs`

- [ ] **Step 1: 写入 category-routing 测试**

```js
import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIES } from "../data/categories.js";
import { SPORTS } from "../data/sports.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(path) {
  return readFileSync(join(ROOT, path), "utf8");
}

describe("category and mode-pick routing", () => {
  it("home category cards push to category page with correct categoryId", () => {
    const home = read("page/home/home.js");

    for (const cat of CATEGORIES) {
      assert.match(
        home,
        new RegExp(`categoryId.*${cat.id}`),
        `home page must navigate to category/${cat.id}`
      );
    }
  });

  it("category page filters sports by categoryId", () => {
    const source = read("page/category/category.js");

    assert.match(source, /getSportsByCategory/);
    assert.match(source, /categoryId/);
    assert.match(source, /parse\(options/);
  });

  it("each category page shows the correct number of sports", () => {
    for (const cat of CATEGORIES) {
      const sports = SPORTS.filter(s => s.categoryId === cat.id);
      assert.ok(sports.length === 4, `${cat.id} should have exactly 4 sports, got ${sports.length}`);
    }
  });

  it("mode-pick page receives sportId and renders two mode cards", () => {
    const source = read("page/mode-pick/mode-pick.js");

    assert.match(source, /sportId/);
    assert.match(source, /"quick"/);
    assert.match(source, /"full"/);
    assert.match(source, /page\/session\/session/);
  });

  it("mode-pick stores recentSportId before navigating to session", () => {
    const source = read("page/mode-pick/mode-pick.js");

    assert.match(source, /recentSportId/);
    assert.match(source, /Storage\.set/);
  });

  it("session passes complete params including sportId, routineType, totalSteps, totalDuration", () => {
    const source = read("page/session/session.js");

    assert.match(source, /sportId/);
    assert.match(source, /routineType/);
    assert.match(source, /totalSteps/);
    assert.match(source, /totalDuration/);
    assert.match(source, /_computeTotalDuration/);
  });

  it("category and mode-pick layouts use named alignment constants", () => {
    for (const page of ["category", "mode-pick"]) {
      for (const shape of ["r", "s"]) {
        const layout = read(`page/${page}/${page}.${shape}.layout.js`);
        const bareNumbers = layout.match(/align_h:\s*\d+/g);
        assert.ok(
          !bareNumbers || bareNumbers.length === 0,
          `${page}.${shape}.layout.js uses bare numeric alignment: ${bareNumbers}`
        );
      }
    }
  });
});
```

---

### Task 18: 验证 + 构建 + 模拟器

**Files:**
- 无

- [ ] **Step 1: 运行验证**

```powershell
npm.cmd run verify
```

Expected: 所有测试通过。

- [ ] **Step 2: 构建**

```powershell
C:\Users\33135\AppData\Roaming\npm\zeus.cmd build -t "Amazfit Balance 2"
```

Expected: build passed.

- [ ] **Step 3: 刷新模拟器**

```powershell
C:\Users\33135\AppData\Roaming\npm\zeus.cmd dev -t "Amazfit Balance 2"
```

Expected: simulator connected, rebuild done, refreshing simulator.

- [ ] **Step 4: 提交阶段 1**

```bash
git add page/home/home.js page/home/home.r.layout.js page/home/home.s.layout.js
git add page/category/
git add page/mode-pick/
git add page/session/session.js
git add page/complete/complete.js page/complete/complete.r.layout.js page/complete/complete.s.layout.js
git add test/fitness-ui-contract.test.mjs test/category-routing.test.mjs
git commit -m "feat: restructure home, add category/mode-pick pages, enhance complete page"
```

---

### Task 19: 阶段 2 — session 流畅度优化

**Files:**
- Modify: `page/session/session.js`

- [ ] **Step 1: tick 频率从 500ms 改为 1000ms**

在 `_ensureTickTimer` 中：

```js
_ensureTickTimer() {
  if (this.state.timerId || !this.state.machine) return;
  this.state.timerId = setInterval(() => this.state.machine.tick(), 1000);
},
```

- [ ] **Step 2: _updateDisplay 增加值缓存**

在 state 中增加缓存字段 `_lastExerciseName`, `_lastSideLabel`, `_lastTimerText`, `_lastProgressText`。

修改 `_updateDisplay`：

```js
_updateDisplay() {
  const ctx = this.state.machine.getContext();
  if (!ctx) return;

  const step = this.state.machine.steps[this.state.machine.currentStepIndex];
  if (!step) return;

  const ex = getExercise(step.exerciseId);
  if (this.state.exerciseNameText && ex) {
    const name = ex.name;
    if (this.state._lastExerciseName !== name) {
      this.state._lastExerciseName = name;
      this.state.exerciseNameText.setProperty(prop.MORE, { text: name });
    }
  }

  if (this.state.sideText) {
    let sideLabel = "";
    if (ctx.substep === "prepare") sideLabel = "Get ready...";
    else if (ctx.substep === "side-switch") sideLabel = "Switch sides...";
    else if (ctx.side === "left") sideLabel = "Left side";
    else if (ctx.side === "right") sideLabel = "Right side";

    if (this.state._lastSideLabel !== sideLabel) {
      this.state._lastSideLabel = sideLabel;
      this.state.sideText.setProperty(prop.MORE, { text: sideLabel });
    }
  }

  if (this.state.timerText) {
    const remaining = Math.max(0, Math.ceil((this.state.machine.deadline - Date.now()) / 1000));
    const text = String(remaining);
    if (this.state._lastTimerText !== text) {
      this.state._lastTimerText = text;
      this.state.timerText.setProperty(prop.MORE, { text });
    }
  }

  if (this.state.progressText) {
    const total = this.state.machine.steps.length;
    const current = Math.min(this.state.machine.currentStepIndex + 1, total);
    const text = `${current} / ${total}`;
    if (this.state._lastProgressText !== text) {
      this.state._lastProgressText = text;
      this.state.progressText.setProperty(prop.MORE, { text });
    }
  }
},
```

在 `onInit` 中初始化缓存：

```js
this.state._lastExerciseName = null;
this.state._lastSideLabel = null;
this.state._lastTimerText = null;
this.state._lastProgressText = null;
```

- [ ] **Step 3: 暂停层复用**

修改 `_showPauseOverlay`：

```js
_showPauseOverlay() {
  if (this.state.pausedGroup) return; // 已存在，不重复创建

  const group = createWidget(widget.GROUP, { x: 0, y: 0, w: Styles.W, h: Styles.H });
  group.createWidget(widget.FILL_RECT, Styles.OVERLAY_BG_STYLE);
  group.createWidget(widget.TEXT, {
    ...Styles.PAUSED_TEXT_STYLE,
    text: "Paused"
  });

  const btnResume = group.createWidget(widget.IMG, Styles.RESUME_BTN_STYLE);
  btnResume.addEventListener(event.CLICK_UP, () => {
    this.state.machine.resume();
    this._hidePauseOverlay();
  });

  const btnSkip = group.createWidget(widget.IMG, Styles.SKIP_BTN_STYLE);
  btnSkip.addEventListener(event.CLICK_UP, () => {
    this.state.machine.skip();
    this._hidePauseOverlay();
    this._updateDisplay();
  });

  const btnEnd = group.createWidget(widget.IMG, Styles.END_BTN_STYLE);
  btnEnd.addEventListener(event.CLICK_UP, () => {
    this.state.machine.end();
    this._hidePauseOverlay();
  });

  this.state.pausedGroup = group;
},
```

关键改动：首次创建后保存引用，后续暂停不再重建。`_hidePauseOverlay` 保持不变（仍然 deleteWidget + 设 null，但下次暂停会重建）——改为隐藏/显示的方式：

```js
_showPauseOverlay() {
  if (this.state.pausedGroup) return;

  const group = createWidget(widget.GROUP, { x: 0, y: 0, w: Styles.W, h: Styles.H });
  // ... 创建所有子 widget
  this.state.pausedGroup = group;
  this.state._pausedVisible = true;
},

_hidePauseOverlay() {
  if (!this.state.pausedGroup) return;
  // 隐藏：将 group 移出屏幕（没有 visibility 属性可用）
  // Zepp widget 没有 visibility，只能用 deleteWidget + 重建
  // 保持现有方式：delete + null，下次暂停重建
  deleteWidget(this.state.pausedGroup);
  this.state.pausedGroup = null;
},
```

**实际结论：** 在 Zepp OS 上 widget 没有 visibility/hidden 属性。当前的 delete + 下次 create 方式无法真正优化。保留现有逻辑不变。这个"暂停层复用"优化跳过。

- [ ] **Step 4: 日志清理**

在 `_onStateChange` 中删除 `console.log`：

当前：
```js
_onStateChange(oldState, newState) {
  console.log(`Session: ${oldState} -> ${newState}`);

  if (newState === STATE_PAUSED) {
```

改为：
```js
_onStateChange(oldState, newState) {
  if (newState === STATE_PAUSED) {
```

保留 `_onExerciseChange` 中的日志（exercise 变更日志有调试价值）。

- [ ] **Step 5: 验证 + 构建**

```powershell
npm.cmd run verify
C:\Users\33135\AppData\Roaming\npm\zeus.cmd build -t "Amazfit Balance 2"
```

---

### Task 20: 阶段 3 — release 打包

**Files:**
- Create: `release/README.md`

- [ ] **Step 1: 生成最终资源**

```powershell
powershell -ExecutionPolicy Bypass -File scripts\generate-assets.ps1 -BackgroundSource assets\gt.r\bg.png -IconSource assets\gt.r\icon.png
```

- [ ] **Step 2: 最终验证和构建**

```powershell
npm.cmd run verify
C:\Users\33135\AppData\Roaming\npm\zeus.cmd build -t "Amazfit Balance 2"
```

- [ ] **Step 3: 检查 dist 目录内容**

```bash
ls -la dist/
```

Expected: 包含构建输出。

- [ ] **Step 4: 创建 release 目录**

```bash
mkdir -p release
cp -r dist/ release/dist/
cp docs/apple-fitness-ui-design.md release/
cp PROJECT_MEMORY.md release/
cp docs/execution-and-smoothness-plan.md release/
cp docs/superpowers/specs/2026-06-06-three-phase-optimization-design.md release/
```

- [ ] **Step 5: 写入 README**

```markdown
# Stretch Coach v1.0.1

Zepp OS 拉伸教练应用。目标设备：Amazfit Balance 2。

## 快速开始

1. 安装依赖：`npm install`
2. 生成资源：`powershell -ExecutionPolicy Bypass -File scripts\generate-assets.ps1 -BackgroundSource assets\gt.r\bg.png -IconSource assets\gt.r\icon.png`
3. 验证：`npm.cmd run verify`
4. 构建：`zeus build -t "Amazfit Balance 2"`
5. 模拟器刷新：`zeus dev -t "Amazfit Balance 2"`

## 目录结构

- dist/ — 构建输出
- docs/ — 设计文档和执行计划
- PROJECT_MEMORY.md — 项目记忆（新对话入口）
```

- [ ] **Step 6: 压缩**

```bash
powershell -Command "Compress-Archive -Path release/* -DestinationPath release/stretch-coach-v1.0.1.zip"
```

不提交 release/ 到 git。

---

### Task 21: 更新 PROJECT_MEMORY.md

**Files:**
- Modify: `PROJECT_MEMORY.md`

- [ ] **Step 1: 更新已知良好状态**

替换 `## Current Known-Good State` 部分为：

```markdown
## Current Known-Good State

Latest known verification result:

\`\`\`text
npm.cmd run verify
all tests passed

validate-assets:
all UI assets present
all animation frames present
all B-style source sprites present

C:\Users\33135\AppData\Roaming\npm\zeus.cmd build -t "Amazfit Balance 2"
build passed

C:\Users\33135\AppData\Roaming\npm\zeus.cmd dev -t "Amazfit Balance 2"
simulator refreshed
\`\`\`

The page flow is now: home → category → mode-pick → session → complete.

Home shows: weekly progress bar, 3 category cards (Cardio/Strength/Ball Sports), green START button, bottom GUIDE/VIBRATION links.

Category page filters sports by category with back navigation.

Mode-pick page offers Quick vs Full routine choice.

Complete page shows summary card (steps, duration, weekly progress) with green HOME button.
```
