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

export const ICON_STYLE = {
  x: px(390 / 2 - 70 / 2),
  y: px(100),
  w: px(70),
  h: px(70)
};

export const MESSAGE_STYLE = {
  x: px(20),
  y: px(190),
  w: px(350),
  h: px(60),
  color: 0xcccccc,
  text_size: px(20),
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const HOME_BTN_STYLE = {
  x: px(390 / 2 - 120 / 2),
  y: px(280),
  w: px(120),
  h: px(50),
  src: "btn_home.png"
};
