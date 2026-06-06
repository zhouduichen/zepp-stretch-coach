import { px } from "@zos/utils";
import { align, setStatusBarVisible } from "@zos/ui";

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
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const CONTENT_STYLE = {
  x: px(20),
  y: px(70),
  w: px(350),
  h: px(300),
  color: 0xc8d0c4,
  text_size: px(18),
  align_h: align.LEFT,
  align_v: align.TOP,
  text_style: 1
};

export const DISMISS_BTN_STYLE = {
  x: px(390 / 2 - 100 / 2),
  y: px(380),
  w: px(100),
  h: px(45),
  src: "btn_ok.png"
};
