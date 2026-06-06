import { px } from "@zos/utils";
import { align, setStatusBarVisible } from "@zos/ui";

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const PROGRESS_LABEL_STYLE = {
  x: px(20),
  y: px(20),
  w: px(180),
  h: px(22),
  color: 0xffffff,
  text_size: px(14),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PROGRESS_VALUE_STYLE = {
  x: px(320),
  y: px(20),
  w: px(50),
  h: px(22),
  color: 0xb6f640,
  text_size: px(14),
  align_h: align.RIGHT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PROGRESS_BG_STYLE = {
  x: px(20),
  y: px(48),
  w: px(350),
  h: px(5),
  color: 0x1e251f
};

export const PROGRESS_FILL_STYLE = {
  x: px(20),
  y: px(48),
  w: px(235),
  h: px(5),
  color: 0xb6f640
};

export const CAT_CARD_STYLE = {
  x: px(20),
  y: 0,
  w: px(350),
  h: px(64)
};

export const CAT_ICON_STYLE = {
  x: px(32),
  y: 0,
  w: px(24),
  h: px(24)
};

export const CAT_NAME_STYLE = {
  x: px(68),
  y: 0,
  w: px(230),
  h: px(40),
  color: 0xffffff,
  text_size: px(18),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const CAT_SUB_STYLE = {
  x: px(68),
  y: px(32),
  w: px(230),
  h: px(22),
  color: 0x9aa497,
  text_size: px(13),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const CAT_ARROW_STYLE = {
  x: px(346),
  y: 0,
  w: px(20),
  h: px(64),
  color: 0xb6f640,
  text_size: px(20),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const CAT1_Y = px(68);
export const CAT2_Y = px(140);
export const CAT3_Y = px(212);

export const START_BTN_STYLE = {
  x: px(20),
  y: px(288),
  w: px(350),
  h: px(55),
  src: "btn_start.png"
};

export const GUIDE_BTN_STYLE = {
  x: px(115),
  y: px(360),
  w: px(70),
  h: px(28),
  color: 0x6a7568,
  text_size: px(13),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const VIBRATION_BTN_STYLE = {
  x: px(205),
  y: px(360),
  w: px(70),
  h: px(28),
  color: 0x6a7568,
  text_size: px(13),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};
