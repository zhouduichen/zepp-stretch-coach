# Stretch Coach 三阶段优化设计

日期：2026-06-06
状态：已确认

## 概述

本设计覆盖三阶段工作：
1. **阶段 1：深度视觉优化** — 重构主页/选择页/完成页，新增两个中间页面
2. **阶段 2：系统操作流畅度优化** — 训练页 tick 频率、setProperty 缓存、暂停层复用
3. **阶段 3：交付打包** — release 目录、构建说明、校验日志、可交付 zip

## 阶段 1：深度视觉优化

### 页面结构变更

当前页面流：home → select → session → complete

新页面流：home → category → mode-pick → session → complete

新增两页：
- `page/category` — 运动项目列表（按大类过滤）
- `page/mode-pick` — Quick/Full 模式选择

home 和 complete 重构，session 不变。

### 主页 (home)

布局（自上而下）：
- 顶部本周进度条：标签"本周目标" + 进度值 "2/3" + 绿色进度条
- 三张大类卡片（Cardio / Strength / Ball Sports）：各含 icon、名称、子项数量、右箭头
- 绿色 START 按钮（主 CTA，全页最显眼）
- 底部 GUIDE / VIBRATION 小文字链接

数据卡片（card_progress.png、card_trend.png）移除，改用纯 widget 进度条。TITLE_STYLE、SUBTITLE_STYLE 移除。START_BTN_STYLE 改为绿色大按钮。

START 按钮行为：跳转到最近一次训练过的运动项目对应的 Quick/Full 选择页。无历史则进入 category 页。

### 大类页 (page/category) — 新增

URL: `page/category/category`
参数: `categoryId`（如 "cardio"）

布局：
- 顶部 ← 返回导航 + 大类名称（如 "Cardio 拉伸"）
- 4 个运动项目卡片：icon + 名称 + 预计时长 + 右箭头
- 点卡片 push 到 mode-pick

根据 `categoryId` 用 `getSportsByCategory(categoryId)` 过滤 SPORTS。

### 模式选择页 (page/mode-pick) — 新增

URL: `page/mode-pick/mode-pick`
参数: `sportId`

布局：
- 顶部 ← 返回导航 + 运动名称（如 "Outdoor Run"）
- Quick 卡片：⚡ icon + "Quick" + "~6 分钟 · 核心拉伸"
- Full 卡片：📋 icon + "Full" + "~12 分钟 · 完整拉伸"
- 点卡片 push 到 session

时长根据 `recommendRoutine(sportId, undefined, { routineType })` 真实计算。

### 训练页 (session)

阶段 1 不改变布局，保持现有设计。只在阶段 2 做流畅度优化。

### 完成页 (complete)

当前：标题 + 图标 + 提示文字 + HOME 按钮
新设计：
- 标题 "Great job!"
- 副标题：运动名称 + 模式 + "全部完成"
- 总结卡（暗色卡片）：三列数据 — 动作数、时长、本周进度（如 2/3）
- 绿色 HOME 按钮

数据来源：
- 动作数：session machine 的 steps.length
- 时长：computeDuration(steps)
- 本周进度：Storage.get(COMPLETION_COUNT) / 3

Session 页需修改 `_onComplete` 传递额外参数到 complete 页：
- `sportId`：当前运动 ID
- `routineType`："quick" 或 "full"
- `totalSteps`：步骤总数
- `totalDuration`：预估总时长（秒）

### 颜色与样式规范

保持现有颜色系统：
- 背景 `#050806`
- 卡片 `#141a15`
- 主强调 `#b6f640`（绿色）
- 辅助 `#6febae` `#58b1ff` `#9aa497`
- 危险 `#ff5860`

新增：
- 进度条底色 `#1e251f`
- START/HOME 按钮用绿色 `#b6f640`，文字深色 `#050806`
- GUIDE/VIBRATION 小字 `#6a7568`

### 圆屏/方屏兼容

所有新页面和修改后的页面必须同时维护 `gt.r`（480x480）和 `gt.s`（390x450）布局。

### 测试更新

- 更新 `test/fitness-ui-contract.test.mjs`：验证主页进度条、大类卡片、绿色 START、底部 GUIDE/VIBRATION
- 新增 `test/category-routing.test.mjs`：验证 category 页过滤正确、mode-pick 页参数传递正确
- 更新 complete 页相关断言

### 不删除的内容

- 旧的 `page/select` 目录保留不动（后续可清理）
- `data/sports.js`、`data/categories.js`、`data/exercises.js` 数据结构不变
- `core/recommendation.js` 逻辑不变
- `core/session-machine.js` 不变

## 阶段 2：系统操作流畅度优化

### 训练页 tick 优化

- 将 `setInterval` 从 500ms 改为 1000ms。计时显示秒级，500ms 造成重复 setProperty
- `_updateDisplay` 增加值缓存：比较新值与上次设置的值，相同时跳过 setProperty
  - 缓存字段：`_lastExerciseName`、`_lastSideLabel`、`_lastTimerText`、`_lastProgressText`

### 暂停层复用

- `_showPauseOverlay` 首次创建暂停层 widget 后保存引用，后续暂停时改为显示（setProperty visibility）而非重新创建
- `_hidePauseOverlay` 改为隐藏而非 deleteWidget
- `onDestroy` 时才真正 deleteWidget

### 动画加载去抖

- 现有 `lastAnimationKey` 已防止重复加载同一动画
- 保持现有逻辑，不引入额外改动

### 存储优化

- 检查 `Storage.migrate()` 调用位置，确保只在 `onInit` 调用一次
- session 完成时只写一次 completion count

### 日志清理

- 删除或降级 session.js 中的 `console.log`（状态切换和动画异常日志保留，tick 路径日志删除）
- 具体：保留 `_onExerciseChange` 中的 exercise 日志，删除 `_onStateChange` 中的状态切换日志

### 资源尺寸检查

- 检查打包中 PNG 文件数量和总大小
- 验证没有未引用的大图进入 dist

## 阶段 3：交付打包

### 生成资源

```powershell
powershell -ExecutionPolicy Bypass -File scripts\generate-assets.ps1 -BackgroundSource assets\gt.r\bg.png -IconSource assets\gt.r\icon.png
```

### 验证

```powershell
npm.cmd run verify
```

### 构建

```powershell
C:\Users\33135\AppData\Roaming\npm\zeus.cmd build -t "Amazfit Balance 2"
```

### 模拟器确认

```powershell
C:\Users\33135\AppData\Roaming\npm\zeus.cmd dev -t "Amazfit Balance 2"
```

### 交付包

新建 `release/` 目录，包含：
- 构建输出（dist/）
- 设计说明（docs/apple-fitness-ui-design.md）
- 项目记忆文档（PROJECT_MEMORY.md）
- 执行计划（docs/execution-and-smoothness-plan.md）
- 校验日志
- README（快速开始说明）
- 压缩为 `stretch-coach-v1.0.1.zip`

## 实现顺序

1. 主页重构（home.js + 两个 layout）
2. 新增 page/category（category.js + 两个 layout）
3. 新增 page/mode-pick（mode-pick.js + 两个 layout）
4. Complete 页重构（complete.js + 两个 layout）
5. 更新测试（fitness-ui-contract + 新增 category-routing）
6. 验证 + 构建 + 模拟器刷新
7. 阶段 2：session 流畅度优化
8. 阶段 3：release 打包
