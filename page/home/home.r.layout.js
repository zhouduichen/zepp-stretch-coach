import { px } from "@zos/utils";
import { align } from "@zos/ui";

export const W = px(480);
export const H = px(480);

// Weekly progress bar
export const PROGRESS_LABEL_STYLE = {
  x: px(40),
  y: px(36),
  w: px(200),
  h: px(24),
  color: 0xffffff,
  text_size: px(16),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PROGRESS_VALUE_STYLE = {
  x: px(390),
  y: px(36),
  w: px(50),
  h: px(24),
  color: 0xb6f640,
  text_size: px(16),
  align_h: align.RIGHT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const PROGRESS_BG_STYLE = {
  x: px(40),
  y: px(66),
  w: px(400),
  h: px(6),
  color: 0x1e251f
};

export const PROGRESS_FILL_STYLE = {
  x: px(40),
  y: px(66),
  w: px(268),
  h: px(6),
  color: 0xb6f640
};

// Category cards
export const CAT_CARD_STYLE = {
  x: px(40),
  y: 0,
  w: px(400),
  h: px(72)
};

export const CAT_ICON_STYLE = {
  x: px(56),
  y: 0,
  w: px(32),
  h: px(32)
};

export const CAT_NAME_STYLE = {
  x: px(100),
  y: 0,
  w: px(260),
  h: px(46),
  color: 0xffffff,
  text_size: px(20),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const CAT_SUB_STYLE = {
  x: px(100),
  y: px(38),
  w: px(260),
  h: px(24),
  color: 0x9aa497,
  text_size: px(15),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
  text_style: 0
};

export const CAT_ARROW_STYLE = {
  x: px(400),
  y: 0,
  w: px(24),
  h: px(72),
  color: 0xb6f640,
  text_size: px(22),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

// Card Y offsets
export const CAT1_Y = px(92);
export const CAT2_Y = px(172);
export const CAT3_Y = px(252);

// Green START button
export const START_BTN_STYLE = {
  x: px(40),
  y: px(340),
  w: px(400),
  h: px(60),
  src: "btn_start.png"
};

// Bottom GUIDE / VIBRATION
export const GUIDE_BTN_STYLE = {
  x: px(140),
  y: px(420),
  w: px(80),
  h: px(30),
  color: 0x6a7568,
  text_size: px(15),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};

export const VIBRATION_BTN_STYLE = {
  x: px(260),
  y: px(420),
  w: px(80),
  h: px(30),
  color: 0x6a7568,
  text_size: px(15),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: 0
};
