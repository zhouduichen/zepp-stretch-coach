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

export const CONTENT_STYLE = {
  x: px(40),
  y: px(100),
  w: px(400),
  h: px(300),
  color: 0xcccccc,
  text_size: px(20),
  align_h: 0,
  align_v: 0,
  text_style: 1
};

export const DISMISS_BTN_STYLE = {
  x: px(480 / 2 - 120 / 2),
  y: px(400),
  w: px(120),
  h: px(50),
  src: "btn_ok.png"
};
