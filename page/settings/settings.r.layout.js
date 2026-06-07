import { px } from "@zos/utils";
import { align } from "@zos/ui";

export const W = px(480);
export const H = px(480);

export const TITLE_STYLE = {
  x: px(0),
  y: px(44),
  w: px(480),
  h: px(46),
  color: 0xffffff,
  text_size: px(30),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUBTITLE_STYLE = {
  x: px(80),
  y: px(86),
  w: px(320),
  h: px(24),
  color: 0x9aa497,
  text_size: px(15),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const OPTION_CARD_STYLE = {
  x: px(58),
  y: px(122),
  w: px(364),
  h: px(182)
};

export const OPTION_LABEL_STYLE = {
  x: px(82),
  y: px(140),
  w: px(280),
  h: px(24),
  color: 0xb6f640,
  text_size: px(15),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const OPTION_VALUE_STYLE = {
  x: px(82),
  y: px(166),
  w: px(320),
  h: px(36),
  color: 0xffffff,
  text_size: px(25),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const OPTION_DESC_STYLE = {
  x: px(82),
  y: px(204),
  w: px(318),
  h: px(26),
  color: 0x9aa497,
  text_size: px(16),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const MODE_SEGMENT_STYLE = {
  x: px(82),
  y: px(248),
  w: px(94),
  h: px(40)
};

export const MODE_SEGMENT_GAP = px(14);

export const MODE_SEGMENT_TEXT_STYLE = {
  x: 0,
  y: 0,
  w: px(94),
  h: px(40),
  color: 0xffffff,
  text_size: px(14),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

// Weekly goal section
export const GOAL_CARD_STYLE = {
  x: px(58),
  y: px(316),
  w: px(364),
  h: px(58)
};

export const GOAL_LABEL_STYLE = {
  x: px(82),
  y: px(334),
  w: px(100),
  h: px(22),
  color: 0xb6f640,
  text_size: px(14),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const GOAL_STEP_BTN_STYLE = {
  w: px(36),
  h: px(36),
  color: 0xffffff,
  text_size: px(28),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const GOAL_VALUE_STYLE = {
  w: px(50),
  h: px(36),
  color: 0xffffff,
  text_size: px(28),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const BACK_BTN_STYLE = {
  x: px(480 / 2 - 100 / 2),
  y: px(400),
  w: px(100),
  h: px(50),
  src: "btn_back.png"
};
