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

export const LIST_START_Y = px(66);
export const LIST_ITEM_H = px(68);
export const BOTTOM_PADDING = px(20);

export const ROW_CARD_STYLE = {
  x: px(20),
  y: 0,
  w: px(350),
  h: px(60)
};

export const SPORT_ICON_STYLE = {
  x: px(32),
  y: 0,
  w: px(38),
  h: px(38)
};

export const ITEM_TEXT_STYLE = {
  x: px(90),
  y: px(2),
  w: px(200),
  h: px(32),
  color: 0xffffff,
  text_size: px(18),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const ITEM_SUB_STYLE = {
  x: px(90),
  y: px(32),
  w: px(200),
  h: px(24),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const ITEM_ARROW_STYLE = {
  x: px(346),
  y: 0,
  w: px(20),
  h: px(60),
  color: 0xb6f640,
  text_size: px(20),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};
