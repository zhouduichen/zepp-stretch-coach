import { px } from "@zos/utils";
import { align } from "@zos/ui";

export const W = px(480);
export const H = px(480);

export const ANIM_STYLE = {
  x: px(88),
  y: px(176),
  w: px(304),
  h: px(228)
};

export const EXERCISE_NAME_STYLE = {
  x: px(20),
  y: px(8),
  w: px(440),
  h: px(32),
  color: 0xffffff,
  text_size: px(24),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SIDE_STYLE = {
  x: px(20),
  y: px(40),
  w: px(440),
  h: px(24),
  color: 0xb6f640,
  text_size: px(18),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const TIMER_STYLE = {
  x: px(0),
  y: px(66),
  w: px(480),
  h: px(66),
  color: 0xffffff,
  text_size: px(60),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PROGRESS_STYLE = {
  x: px(0),
  y: px(136),
  w: px(480),
  h: px(22),
  color: 0x9aa497,
  text_size: px(17),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PAUSE_BTN_STYLE = {
  x: px(480 / 2 - 50 / 2),
  y: px(420),
  w: px(50),
  h: px(50),
  src: "btn_pause_red.png"
};

// Pause overlay
export const OVERLAY_BG_STYLE = {
  x: px(0),
  y: px(0),
  w: px(480),
  h: px(480),
  color: 0x050806,
  alpha: 180
};

export const PAUSED_TEXT_STYLE = {
  x: px(0),
  y: px(60),
  w: px(480),
  h: px(50),
  color: 0xffffff,
  text_size: px(32),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const RESUME_BTN_STYLE = {
  x: px(480 / 2 - 100 / 2),
  y: px(140),
  w: px(100),
  h: px(50),
  src: "btn_resume_green.png"
};

export const SKIP_BTN_STYLE = {
  x: px(480 / 2 - 100 / 2),
  y: px(210),
  w: px(100),
  h: px(50),
  src: "btn_skip.png"
};

export const END_BTN_STYLE = {
  x: px(480 / 2 - 100 / 2),
  y: px(280),
  w: px(100),
  h: px(50),
  src: "btn_end.png"
};
