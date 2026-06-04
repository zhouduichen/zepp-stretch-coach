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

export const SUBTITLE_STYLE = {
  x: px(40),
  y: px(130),
  w: px(400),
  h: px(40),
  color: 0xaaaaaa,
  text_size: px(22),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const START_BTN_STYLE = {
  x: px(480 / 2 - 200 / 2),
  y: px(200),
  w: px(200),
  h: px(60),
  src: "btn_start.png"
};

export const SAFETY_BTN_STYLE = {
  x: px(480 / 2 - 200 / 2),
  y: px(280),
  w: px(200),
  h: px(60),
  src: "btn_safety.png"
};

export const SETTINGS_BTN_STYLE = {
  x: px(480 / 2 - 200 / 2),
  y: px(360),
  w: px(200),
  h: px(60),
  src: "btn_settings.png"
};

export const COUNT_STYLE = {
  x: px(0),
  y: px(420),
  w: px(480),
  h: px(30),
  color: 0x666666,
  text_size: px(18),
  align_h: 2,
  align_v: 2,
  text_style: 0
};
