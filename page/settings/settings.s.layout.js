import { px } from "@zos/utils";
import { setStatusBarVisible } from '@zos/ui';

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const TITLE_STYLE = {
  x: px(0),
  y: px(20),
  w: px(390),
  h: px(40),
  color: 0xffffff,
  text_size: px(28),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const OPTION_START_Y = px(80);
export const OPTION_H = px(65);

export const OPTION_LABEL_STYLE = {
  x: px(20),
  y: 0,
  w: px(260),
  h: px(32),
  color: 0xffffff,
  text_size: px(20),
  align_h: 0,
  align_v: 2,
  text_style: 0
};

export const OPTION_VALUE_STYLE = {
  x: px(20),
  y: px(28),
  w: px(260),
  h: px(28),
  color: 0x888888,
  text_size: px(16),
  align_h: 0,
  align_v: 2,
  text_style: 0
};

export const BACK_BTN_STYLE = {
  x: px(390 / 2 - 90 / 2),
  y: px(370),
  w: px(90),
  h: px(45),
  src: "btn_back.png"
};
