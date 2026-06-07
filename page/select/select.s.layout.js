import { px } from "@zos/utils";
import { align, setStatusBarVisible } from "@zos/ui";

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const TITLE_STYLE = {
  x: px(0),
  y: px(16),
  w: px(390),
  h: px(40),
  color: 0xffffff,
  text_size: px(28),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const RECOMMENDATION_CARD_STYLE = {
  x: px(24),
  y: px(66),
  w: px(342),
  h: px(102)
};

export const RECOMMENDATION_ICON_STYLE = {
  x: px(42),
  y: px(101),
  w: px(38),
  h: px(38)
};

export const RECOMMENDATION_EYEBROW_STYLE = {
  x: px(94),
  y: px(78),
  w: px(166),
  h: px(22),
  color: 0xb6f640,
  text_size: px(14),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const RECOMMENDATION_TITLE_STYLE = {
  x: px(94),
  y: px(100),
  w: px(160),
  h: px(30),
  color: 0xffffff,
  text_size: px(21),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const RECOMMENDATION_META_STYLE = {
  x: px(94),
  y: px(130),
  w: px(188),
  h: px(24),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const RECOMMENDATION_CTA_STYLE = {
  x: px(292),
  y: px(100),
  w: px(56),
  h: px(38),
  color: 0xb6f640,
  text_size: px(14),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const LIST_START_Y = px(188);
export const CATEGORY_H = px(34);
export const LIST_ITEM_H = px(64);
export const CATEGORY_GAP = px(10);
export const BOTTOM_PADDING = px(30);

export const ROW_BG_STYLE = {
  x: px(14),
  y: 0,
  w: px(362),
  h: px(60),
  color: 0x141a15,
  alpha: 1
};

export const ROW_CARD_STYLE = {
  x: px(14),
  y: 0,
  w: px(362),
  h: px(60),
  src: "row_card.png"
};

export const CATEGORY_ICON_STYLE = {
  x: px(24),
  y: 0,
  w: px(24),
  h: px(24)
};

export const CATEGORY_ICON_OFFSET_Y = px(5);

export const CATEGORY_TEXT_STYLE = {
  x: px(74),
  y: 0,
  w: px(280),
  h: px(34),
  color: 0xb6f640,
  text_size: px(18),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SPORT_ICON_STYLE = {
  x: px(24),
  y: 0,
  w: px(38),
  h: px(38)
};

export const ITEM_TEXT_STYLE = {
  x: px(96),
  y: px(2),
  w: px(168),
  h: px(36),
  color: 0xffffff,
  text_size: px(19),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const ITEM_SUB_STYLE = {
  x: px(96),
  y: px(34),
  w: px(132),
  h: px(26),
  color: 0x9aa497,
  text_size: px(16),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const RECOMMEND_TAG_STYLE = {
  x: px(296),
  y: px(15),
  w: px(60),
  h: px(24),
  color: 0xb6f640,
  text_size: px(14),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};
