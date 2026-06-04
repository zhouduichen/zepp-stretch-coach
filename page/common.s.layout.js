import { px } from "@zos/utils";
import { setStatusBarVisible } from '@zos/ui'

setStatusBarVisible(false)

export const SCREEN_STYLE = {
  x: px(0),
  y: px(0),
  w: px(390),
  h: px(450),
};

export const BTN_ASK_STYLE = {
  x: px(390 - 20 - 64 + 17),
  y: px(450 / 2 - 64 / 2),
  w: px(64),
  h: px(64),
  src: "ask.png",
};
