import { px } from "@zos/utils";
import { align, setStatusBarVisible } from "@zos/ui";

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const ANIM_STYLE = {
  x: px(63),
  y: px(158),
  w: px(264),
  h: px(198)
};

export const EXERCISE_NAME_STYLE = {
  x: px(10),
  y: px(4),
  w: px(370),
  h: px(30),
  color: 0xffffff,
  text_size: px(21),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SIDE_STYLE = {
  x: px(10),
  y: px(34),
  w: px(370),
  h: px(22),
  color: 0xb6f640,
  text_size: px(17),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const TIMER_STYLE = {
  x: px(0),
  y: px(56),
  w: px(390),
  h: px(66),
  color: 0xffffff,
  text_size: px(58),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PROGRESS_STYLE = {
  x: px(0),
  y: px(124),
  w: px(390),
  h: px(20),
  color: 0x9aa497,
  text_size: px(15),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PAUSE_BTN_STYLE = {
  x: px(390 / 2 - 45 / 2),
  y: px(380),
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
  color: 0x050806,
  alpha: 180
};

export const PAUSED_TEXT_STYLE = {
  x: px(0),
  y: px(50),
  w: px(390),
  h: px(45),
  color: 0xffffff,
  text_size: px(28),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
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
