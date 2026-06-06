# Stretch Coach 执行记录与流畅度优化计划

更新时间：2026-06-06

本文档用于交接当前已经完成的任务、下一阶段需要完成的工作，以及系统操作流畅度优化思路。后续新对话应先阅读 `PROJECT_MEMORY.md` 和本文档。

## 参考依据

- Apple Human Interface Guidelines：强调清晰层级、视觉和谐、平台一致性。参考：https://developer.apple.com/design/human-interface-guidelines/
- Apple watchOS 设计指南：强调快速、可扫视、单屏关键交互，减少导航层级。参考：https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos
- 本项目约束：Zepp OS 原生 widget + 生成 PNG 资产，不引入 Web UI 框架，不回退到旧运动素材风格。

## 已完成任务

### 运动素材与动画

- 确认运动素材基准为 `resources/symbols/quad-source.png`。
- 运动素材统一使用 `resources/symbols/*-source.png` 的 B-style：黄绿色身体、橙色目标肌肉、透明背景、`320x240`。
- 新增/维护 B-style 动画生成链路：`scripts/generate-b-style-animations.ps1`。
- 生成 `gt.r` 与 `gt.s` 两套运动动画帧。
- 为单侧动作生成 `_left` 和 `_right` 两套镜像动画，避免左右侧显示同方向。
- 增加动画视觉尺寸归一化，避免侧弓步和摆腿这类宽窄不同动作在训练页大小不一致。

### 页面布局与 bug 修复

- 修复 Zepp 对齐常量问题：布局文件改用 `align.CENTER_H`、`align.CENTER_V`、`align.LEFT`，避免裸数字导致文字偏移。
- 修复 Select Activity 文字错位：行内标题、时长、Quick/Full 标签都使用 layout 中的相对 `y` 偏移。
- 修复圆屏左侧图标显示不全：为圆屏安全边界重排分类图标和运动图标。
- 修复 Zepp `IMG` 裁切问题：生成器输出与 widget 盒子同尺寸的图标资源。
- 修复训练页左右动作素材不分方向的问题：session 根据 side 加载不同动画 prefix。

### UI 视觉升级

- 生成新的深色运动背景 `bg.png`，不再直接复制旧复杂背景图。
- 重做按钮资源：主按钮使用绿色/薄荷渐变，次按钮使用暗色玻璃卡片面，危险按钮使用红色弱填充。
- 主页新增数据可视化卡片：
  - `card_progress.png`：目标进度环。
  - `card_trend.png`：训练趋势折线。
- 主页布局改为：标题、副标题、两张数据卡、三枚核心操作按钮。
- 移除主页底部 `Completed: 1` 这种调试感文案，把完成次数收进 `Sessions` 数据卡。
- Select Activity 新增 `row_card.png`，用圆角暗色行卡替代方块列表底色。
- 统一旧橙色强调色为更运动、更克制的绿色主强调色。

### 测试与构建

- 新增 `test/fitness-ui-contract.test.mjs`，约束新背景、新按钮、主页数据卡、选择页行卡和主页留白。
- 保留并通过现有布局、动画、选择页、session 状态机等回归测试。
- 当前验证结果：
  - `npm.cmd run verify` 通过。
  - 46 个测试通过。
  - `scripts/validate-assets.mjs` 通过。
  - 62 个 UI 资产、552 帧动画、24 个 B-style 源素材、17 个左右侧动作集。
- 已安装 Zepp CLI：
  - `@zeppos/zeus-cli@1.9.1`
  - shim 路径：`C:\Users\33135\AppData\Roaming\npm\zeus.cmd`
- `zeus build -t "Amazfit Balance 2"` 构建成功。
- `zeus dev -t "Amazfit Balance 2"` 已连接模拟器并刷新成功。

## 当前不足

- 主页仍偏“菜单 + 两张小卡”，缺少真正像运动 App 的首屏仪表盘记忆点。
- 选择页虽然卡片化了，但列表层级还可以更轻，避免连续卡片造成视觉重复。
- 完成页还偏简单，没有足够精致的完成反馈和数据总结。
- 训练页功能稳定，但操作流畅度仍有优化空间：tick 频率、TEXT 更新、暂停层创建销毁、动画加载时机都可以更克制。
- 打包给别人时还缺一个明确的 release 目录、构建说明、校验结果和可交付压缩包。

## 下一阶段工作

### 阶段 1：深度视觉优化

- 主页改成更强的运动仪表盘：
  - 顶部品牌弱化，突出目标环和今日/本周训练状态。
  - 两张小卡升级为一张主目标环 + 两个小统计指标。
  - 操作按钮改成底部 dock 或单主按钮 + 次级图标按钮，减少网页 CTA 感。
- Select Activity 优化为更原生的 watchOS 滚动流：
  - 分类标题更轻。
  - 行卡减少阴影，改为材质分组和细分割。
  - Quick/Full 标签改得更像状态文本，减少按钮感。
- Session 训练页优化：
  - 计时器和动作素材形成更清晰视觉轴线。
  - 进度从 `5 / 16` 文字升级为小型进度条或阶段点。
  - 左右侧提示和准备状态使用更清晰的颜色/位置。
- Complete 页面升级：
  - 增加完成总结卡：动作数、预计时长、目标贡献。
  - 完成按钮和提示更克制，减少“网页成功页”味道。

### 阶段 2：系统操作流畅度优化

- 训练页 tick 从 `500ms` 评估调整到 `1000ms` 或“秒变化才更新”：
  - 当前计时显示是秒级，500ms 会造成重复 `setProperty`。
  - 目标是减少 JS 定时器和 UI 属性更新压力。
- `_updateDisplay` 做值缓存：
  - 只有动作名、侧边提示、剩余秒数、进度文本变化时才 `setProperty`。
  - 避免每 tick 重复设置相同文本。
- 动画加载去抖：
  - 已有 `lastAnimationKey`，继续保留。
  - 下一步检查 side switch 时是否存在不必要的 destroy/create。
- 暂停层优化：
  - 当前每次暂停 create，恢复 delete。
  - 可评估改为首次创建后隐藏/显示，减少反复创建销毁 widget。
- 选择页滚动优化：
  - 当前一次性创建全部行，数据量尚可，但后续如果加更多运动项目，需要虚拟化或分页。
  - 当前先控制每行 widget 数量，不引入动态复杂效果。
- 存储优化：
  - `Storage.migrate()` 不应在热路径多次调用。
  - session 完成时只写一次完成次数。
- 日志优化：
  - 删除或降级训练热路径中的 `console.log`，尤其是状态切换和动画异常之外的日志。
- 资源优化：
  - 继续把复杂视觉放到 PNG 生成器中，运行时只渲染轻量 widget。
  - 检查 PNG 尺寸和数量，避免不必要的大图进入包。

### 阶段 3：交付打包

- 生成资源：
  - `powershell -ExecutionPolicy Bypass -File scripts\generate-assets.ps1 -BackgroundSource assets\gt.r\bg.png -IconSource assets\gt.r\icon.png`
- 验证：
  - `npm.cmd run verify`
- 构建：
  - `C:\Users\33135\AppData\Roaming\npm\zeus.cmd build -t "Amazfit Balance 2"`
- 模拟器确认：
  - `C:\Users\33135\AppData\Roaming\npm\zeus.cmd dev -t "Amazfit Balance 2"`
  - 刷新后停止 watcher。
- 交付包：
  - 新建 `release/`。
  - 放入构建输出、设计说明、项目记忆文档、校验日志和使用说明。
  - 压缩为可发给别人使用的 zip 包。

## 流畅度优化验收标准

- 训练页倒计时不跳字、不重复闪烁。
- 暂停/恢复没有明显卡顿。
- 切换左右侧时动画方向正确，且素材大小稳定。
- 选择页滚动不卡顿，图标不裁切，文字不重叠。
- 首页进入后信息清晰，按钮点击反馈明确。
- `npm.cmd run verify` 全绿。
- `zeus build` 成功。
- 模拟器刷新后首屏、选择页、训练页、完成页都可正常操作。

## 后续记录方式

每完成一轮优化，追加以下内容：

```text
日期：
完成内容：
修改文件：
生成资源：
验证命令：
构建/模拟器结果：
仍存在的问题：
下一步：
```
