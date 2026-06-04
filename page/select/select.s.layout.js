import { px } from "@zos/utils";
import { setStatusBarVisible } from '@zos/ui';

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
  align_h: 2,
  align_v: 2,
  text_style: 0
};

export const LIST_START_Y = px(66);
export const CATEGORY_H = px(34);
export const LIST_ITEM_H = px(64);
export const CATEGORY_GAP = px(10);
export const BOTTOM_PADDING = px(30);

export const ROW_BG_STYLE = {
  x: px(14),
  y: 0,
  w: px(362),
  h: px(60),
  color: 0x071525,
  alpha: 35
};

export const CATEGORY_ICON_STYLE = {
  x: px(24),
  y: 0,
  w: px(26),
  h: px(26)
};

export const SPORT_ICON_STYLE = {
  x: px(24),
  y: 0,
  w: px(44),
  h: px(44)
};

export const ITEM_TEXT_STYLE = {
  x: px(78),
  y: 0,
  w: px(200),
  h: px(36),
  color: 0xffffff,
  text_size: px(19),
  align_h: 0,
  align_v: 2,
  text_style: 0
};

export const ITEM_SUB_STYLE = {
  x: px(78),
  y: px(29),
  w: px(160),
  h: px(28),
  color: 0x888888,
  text_size: px(16),
  align_h: 0,
  align_v: 2,
  text_style: 0
};

export const RECOMMEND_TAG_STYLE = {
  x: px(292),
  y: px(15),
  w: px(62),
  h: px(24),
  color: 0xf48839,
  text_size: px(14),
  align_h: 2,
  align_v: 2,
  text_style: 0
};
