import { px } from "@zos/utils";

export const W = px(480);
export const H = px(480);

export const TITLE_STYLE = {
  x: px(0),
  y: px(40),
  w: px(480),
  h: px(50),
  color: 0xffffff,
  text_size: px(32),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const OPTION_START_Y = px(110);
export const OPTION_H = px(70);

export const OPTION_LABEL_STYLE = {
  x: px(30),
  y: 0,
  w: px(300),
  h: px(35),
  color: 0xffffff,
  text_size: px(22),
  align_h: 0,
  align_v: 2,
  text_style: 0
};

export const OPTION_VALUE_STYLE = {
  x: px(30),
  y: px(30),
  w: px(300),
  h: px(30),
  color: 0x888888,
  text_size: px(18),
  align_h: 0,
  align_v: 2,
  text_style: 0
};

export const BACK_BTN_STYLE = {
  x: px(480 / 2 - 100 / 2),
  y: px(400),
  w: px(100),
  h: px(50),
  src: "btn_back.png"
};
