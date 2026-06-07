import { px } from "@zos/utils";
import { align, setStatusBarVisible } from "@zos/ui";

setStatusBarVisible(false);

export const W = px(390);
export const H = px(450);

export const TITLE_STYLE = {
  x: px(20),
  y: px(104),
  w: px(350),
  h: px(38),
  color: 0xffffff,
  text_size: px(28),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const RESULT_BADGE_STYLE = {
  x: px(155),
  y: px(24),
  w: px(80),
  h: px(80)
};

export const SUBTITLE_STYLE = {
  x: px(20),
  y: px(140),
  w: px(350),
  h: px(22),
  color: 0x9aa497,
  text_size: px(14),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const STATUS_STYLE = {
  x: px(20),
  y: px(164),
  w: px(350),
  h: px(20),
  color: 0x6febae,
  text_size: px(13),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_CARD_STYLE = {
  x: px(30),
  y: px(206),
  w: px(330),
  h: px(96)
};

export const SUMMARY_ACCENT_STYLE = {
  x: px(46),
  y: px(220),
  w: px(3),
  h: px(68)
};

export const SUMMARY_VALUE_1_STYLE = {
  x: px(45),
  y: px(222),
  w: px(90),
  h: px(30),
  color: 0xffffff,
  text_size: px(24),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_LABEL_1_STYLE = {
  x: px(45),
  y: px(252),
  w: px(90),
  h: px(20),
  color: 0x9aa497,
  text_size: px(12),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_VALUE_2_STYLE = {
  x: px(150),
  y: px(222),
  w: px(90),
  h: px(30),
  color: 0x6febae,
  text_size: px(24),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_LABEL_2_STYLE = {
  x: px(150),
  y: px(252),
  w: px(90),
  h: px(20),
  color: 0x9aa497,
  text_size: px(12),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_VALUE_3_STYLE = {
  x: px(255),
  y: px(222),
  w: px(90),
  h: px(30),
  color: 0xb6f640,
  text_size: px(24),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const SUMMARY_LABEL_3_STYLE = {
  x: px(255),
  y: px(252),
  w: px(90),
  h: px(20),
  color: 0x9aa497,
  text_size: px(12),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const HOME_BTN_STYLE = {
  x: px(125),
  y: px(330),
  w: px(140),
  h: px(55),
  src: "btn_home.png"
};
