import { px } from "@zos/utils";
import { setStatusBarVisible } from '@zos/ui';

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const ANIM_STYLE = {
  x: px(20),
  y: px(30),
  w: px(350),
  h: px(260)
};

export const EXERCISE_NAME_STYLE = {
  x: px(10),
  y: px(5),
  w: px(370),
  h: px(35),
  color: 0xffffff,
  text_size: px(22),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const SIDE_STYLE = {
  x: px(10),
  y: px(38),
  w: px(370),
  h: px(25),
  color: 0xf48839,
  text_size: px(18),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const TIMER_STYLE = {
  x: px(0),
  y: px(78),
  w: px(390),
  h: px(70),
  color: 0xffffff,
  text_size: px(64),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const PROGRESS_STYLE = {
  x: px(0),
  y: px(150),
  w: px(390),
  h: px(22),
  color: 0x888888,
  text_size: px(16),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const PAUSE_BTN_STYLE = {
  x: px(390 / 2 - 45 / 2),
  y: px(360),
  w: px(45),
  h: px(45),
  src: "btn_pause_red.png"
};

// Pause overlay
export const OVERLAY_BG_STYLE = {
  x: px(0),
  y: px(0),
  w: px(390),
  h: px(450),
  color: 0x000000,
  alpha: 180
};

export const PAUSED_TEXT_STYLE = {
  x: px(0),
  y: px(50),
  w: px(390),
  h: px(45),
  color: 0xffffff,
  text_size: px(28),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const RESUME_BTN_STYLE = {
  x: px(390 / 2 - 90 / 2),
  y: px(120),
  w: px(90),
  h: px(45),
  src: "btn_resume_green.png"
};

export const SKIP_BTN_STYLE = {
  x: px(390 / 2 - 90 / 2),
  y: px(180),
  w: px(90),
  h: px(45),
  src: "btn_skip.png"
};

export const END_BTN_STYLE = {
  x: px(390 / 2 - 90 / 2),
  y: px(240),
  w: px(90),
  h: px(45),
  src: "btn_end.png"
};
