import { px } from "@zos/utils";
import { setStatusBarVisible } from '@zos/ui';

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const TITLE_STYLE = {
  x: px(0),
  y: px(40),
  w: px(390),
  h: px(50),
  color: 0xffffff,
  text_size: px(32),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const SUBTITLE_STYLE = {
  x: px(20),
  y: px(100),
  w: px(350),
  h: px(40),
  color: 0xaaaaaa,
  text_size: px(20),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const START_BTN_STYLE = {
  x: px(390 / 2 - 180 / 2),
  y: px(170),
  w: px(180),
  h: px(55),
  src: "btn_start.png"
};

export const SAFETY_BTN_STYLE = {
  x: px(390 / 2 - 180 / 2),
  y: px(240),
  w: px(180),
  h: px(55),
  src: "btn_safety.png"
};

export const SETTINGS_BTN_STYLE = {
  x: px(390 / 2 - 180 / 2),
  y: px(310),
  w: px(180),
  h: px(55),
  src: "btn_settings.png"
};

export const COUNT_STYLE = {
  x: px(0),
  y: px(390),
  w: px(390),
  h: px(30),
  color: 0x666666,
  text_size: px(16),
  align_h: 2,
  align_v: 2,
  text_style: 0
};
