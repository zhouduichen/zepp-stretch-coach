# Stretch Coach v1.0.1

Zepp OS 拉伸教练应用。目标设备：Amazfit Balance 2。

## 页面流程

home → category → mode-pick → session → complete

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

## 验证结果

53 tests passed
62 UI assets
552 animation frames
24 B-style source sprites
17 side-aware animation sets
build passed
