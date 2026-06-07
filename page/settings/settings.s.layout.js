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

export const SUBTITLE_STYLE = {
  x: px(36),
  y: px(60),
  w: px(318),
  h: px(22),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const OPTION_CARD_STYLE = {
  x: px(22),
  y: px(92),
  w: px(346),
  h: px(174)
};

export const OPTION_LABEL_STYLE = {
  x: px(44),
  y: px(108),
  w: px(280),
  h: px(22),
  color: 0xb6f640,
  text_size: px(14),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const OPTION_VALUE_STYLE = {
  x: px(44),
  y: px(132),
  w: px(300),
  h: px(34),
  color: 0xffffff,
  text_size: px(23),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const OPTION_DESC_STYLE = {
  x: px(44),
  y: px(168),
  w: px(300),
  h: px(24),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const MODE_SEGMENT_STYLE = {
  x: px(44),
  y: px(210),
  w: px(86),
  h: px(38)
};

export const MODE_SEGMENT_GAP = px(12);

export const MODE_SEGMENT_TEXT_STYLE = {
  x: 0,
  y: 0,
  w: px(86),
  h: px(38),
  color: 0xffffff,
  text_size: px(13),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const BACK_BTN_STYLE = {
  x: px(390 / 2 - 100 / 2),
  y: px(350),
  w: px(100),
  h: px(50),
  src: "btn_back.png"
};
