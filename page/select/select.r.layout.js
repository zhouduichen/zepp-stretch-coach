import { px } from "@zos/utils";
import { align } from "@zos/ui";

export const W = px(480);
export const H = px(480);

export const TITLE_STYLE = {
  x: px(0),
  y: px(34),
  w: px(480),
  h: px(46),
  color: 0xffffff,
  text_size: px(30),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const LIST_START_Y = px(92);
export const CATEGORY_H = px(38);
export const LIST_ITEM_H = px(68);
export const CATEGORY_GAP = px(12);
export const BOTTOM_PADDING = px(36);

export const ROW_BG_STYLE = {
  x: px(24),
  y: 0,
  w: px(432),
  h: px(64),
  color: 0x141a15,
  alpha: 1
};

export const ROW_CARD_STYLE = {
  x: px(24),
  y: 0,
  w: px(432),
  h: px(64),
  src: "row_card.png"
};

export const CATEGORY_ICON_STYLE = {
  x: px(58),
  y: 0,
  w: px(32),
  h: px(32)
};

export const CATEGORY_ICON_OFFSET_Y = px(3);

export const CATEGORY_TEXT_STYLE = {
  x: px(118),
  y: 0,
  w: px(330),
  h: px(35),
  color: 0xb6f640,
  text_size: px(20),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SPORT_ICON_STYLE = {
  x: px(62),
  y: 0,
  w: px(42),
  h: px(42)
};

export const ITEM_TEXT_STYLE = {
  x: px(134),
  y: px(2),
  w: px(190),
  h: px(38),
  color: 0xffffff,
  text_size: px(21),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const ITEM_SUB_STYLE = {
  x: px(134),
  y: px(36),
  w: px(160),
  h: px(26),
  color: 0x9aa497,
  text_size: px(16),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const RECOMMEND_TAG_STYLE = {
  x: px(370),
  y: px(17),
  w: px(64),
  h: px(26),
  color: 0xb6f640,
  text_size: px(16),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};
