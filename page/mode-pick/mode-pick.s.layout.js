import { px } from "@zos/utils";
import { align, setStatusBarVisible } from "@zos/ui";

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const BACK_AREA_STYLE = {
  x: px(0),
  y: px(18),
  w: px(100),
  h: px(36)
};

export const BACK_ARROW_STYLE = {
  x: px(22),
  y: px(22),
  w: px(22),
  h: px(26),
  color: 0xb6f640,
  text_size: px(22),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const TITLE_STYLE = {
  x: px(58),
  y: px(20),
  w: px(310),
  h: px(32),
  color: 0xffffff,
  text_size: px(20),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const MODE_CARD_STYLE = {
  x: px(30),
  y: 0,
  w: px(330),
  h: px(72)
};

export const MODE_ICON_STYLE = {
  x: px(50),
  y: 0,
  w: px(36),
  h: px(36)
};

export const MODE_NAME_STYLE = {
  x: px(100),
  y: px(6),
  w: px(200),
  h: px(30),
  color: 0xffffff,
  text_size: px(20),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const MODE_DESC_STYLE = {
  x: px(100),
  y: px(40),
  w: px(200),
  h: px(24),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const MODE_ARROW_STYLE = {
  x: px(346),
  y: 0,
  w: px(20),
  h: px(72),
  color: 0xb6f640,
  text_size: px(20),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const QUICK_Y = px(82);
export const FULL_Y = px(170);
