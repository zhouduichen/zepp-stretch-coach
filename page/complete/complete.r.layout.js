import { px } from "@zos/utils";

export const W = px(480);
export const H = px(480);

export const TITLE_STYLE = {
  x: px(0),
  y: px(60),
  w: px(480),
  h: px(60),
  color: 0xffffff,
  text_size: px(36),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const ICON_STYLE = {
  x: px(480 / 2 - 80 / 2),
  y: px(130),
  w: px(80),
  h: px(80)
};

export const MESSAGE_STYLE = {
  x: px(40),
  y: px(230),
  w: px(400),
  h: px(60),
  color: 0xcccccc,
  text_size: px(22),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const HOME_BTN_STYLE = {
  x: px(480 / 2 - 140 / 2),
  y: px(320),
  w: px(140),
  h: px(55),
  src: "btn_home.png"
};
