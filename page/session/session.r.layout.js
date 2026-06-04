import { px } from "@zos/utils";

export const W = px(480);
export const H = px(480);

export const ANIM_STYLE = {
  x: px(40),
  y: px(40),
  w: px(400),
  h: px(300)
};

export const EXERCISE_NAME_STYLE = {
  x: px(20),
  y: px(10),
  w: px(440),
  h: px(40),
  color: 0xffffff,
  text_size: px(26),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const SIDE_STYLE = {
  x: px(20),
  y: px(45),
  w: px(440),
  h: px(30),
  color: 0xf48839,
  text_size: px(20),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const TIMER_STYLE = {
  x: px(0),
  y: px(95),
  w: px(480),
  h: px(80),
  color: 0xffffff,
  text_size: px(72),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const PROGRESS_STYLE = {
  x: px(0),
  y: px(180),
  w: px(480),
  h: px(24),
  color: 0x888888,
  text_size: px(18),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const PAUSE_BTN_STYLE = {
  x: px(480 / 2 - 50 / 2),
  y: px(390),
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
  color: 0x000000,
  alpha: 180
};

export const PAUSED_TEXT_STYLE = {
  x: px(0),
  y: px(60),
  w: px(480),
  h: px(50),
  color: 0xffffff,
  text_size: px(32),
  align_h: 2,
  align_v: 2,
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
