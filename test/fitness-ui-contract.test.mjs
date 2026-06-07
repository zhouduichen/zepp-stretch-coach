/**
 * Tests for the Apple Fitness-inspired visual direction (v2).
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return readFileSync(join(ROOT, relativePath), "utf8");
}

function pxValue(source, styleName, propName) {
  const styleMatch = source.match(new RegExp(`export const ${styleName} = \\{([\\s\\S]*?)\\};`));
  assert.ok(styleMatch, `Missing style ${styleName}`);

  const propMatch = styleMatch[1].match(new RegExp(`${propName}:\\s*px\\(([-\\d.]+)\\)`));
  assert.ok(propMatch, `Missing ${styleName}.${propName}`);
  return Number(propMatch[1]);
}

function exportedPxValue(source, name) {
  const match = source.match(new RegExp(`export const ${name} = px\\(([-\\d.]+)\\);`));
  assert.ok(match, `Missing ${name}`);
  return Number(match[1]);
}

function roundSafeEdgeAtCenterY(y, h, size) {
  const radius = size / 2;
  const centerY = y + h / 2;
  const dy = Math.abs(centerY - radius);
  return radius - Math.sqrt((radius * radius) - (dy * dy));
}

function assertRoundSafeRect(layout, styleName, margin = 8, yOverride = null) {
  const screenW = exportedPxValue(layout, "W");
  const x = pxValue(layout, styleName, "x");
  const y = yOverride ?? pxValue(layout, styleName, "y");
  const w = pxValue(layout, styleName, "w");
  const h = pxValue(layout, styleName, "h");
  const safeLeft = roundSafeEdgeAtCenterY(y, h, screenW) + margin;
  const safeRight = screenW - safeLeft;

  assert.ok(
    x >= safeLeft,
    `${styleName} starts at ${x}px, outside round safe left ${safeLeft.toFixed(1)}px`
  );
  assert.ok(
    x + w <= safeRight,
    `${styleName} ends at ${x + w}px, outside round safe right ${safeRight.toFixed(1)}px`
  );
}

describe("fitness UI visual contract", () => {
  it("uses a generated quiet fitness background instead of the old busy art", () => {
    const source = read("scripts/generate-assets.ps1");

    assert.match(source, /function Draw-FitnessBackground/);
    assert.match(source, /Draw-FitnessBackground \(Join-Path \$assetRoot "bg\.png"\) \$screenWidth \$screenHeight/);
    assert.doesNotMatch(
      source,
      /Resize-Cover \$BackgroundSource \(Join-Path \$assetRoot "bg\.png"\)/,
      "The app background should be generated from the calm fitness palette, not copied from the old busy image."
    );
  });

  it("uses primary and secondary fitness buttons instead of rainbow gradients", () => {
    const source = read("scripts/generate-assets.ps1");

    assert.match(source, /function Draw-FitnessButton/);
    assert.match(source, /btn_start\.png"\) 200 60 "START" "primary"/);
    assert.match(source, /btn_safety\.png"\) 200 60 "GUIDE" "secondary"/);
    assert.match(source, /btn_settings\.png"\) 200 60 "VIBRATION" "secondary"/);
  });

  it("home page shows progress bar and three large category cards with a green START button", () => {
    const home = read("page/home/home.js");
    const homeR = read("page/home/home.r.layout.js");
    const homeS = read("page/home/home.s.layout.js");

    // Progress bar styles exist in round layout
    assert.match(homeR, /PROGRESS_LABEL_STYLE/);
    assert.match(homeR, /PROGRESS_VALUE_STYLE/);
    assert.match(homeR, /PROGRESS_BG_STYLE/);
    assert.match(homeR, /PROGRESS_FILL_STYLE/);
    // Progress bar styles exist in square layout
    assert.match(homeS, /PROGRESS_LABEL_STYLE/);

    // Category card styles
    assert.match(homeR, /CAT_CARD_STYLE/);
    assert.match(homeR, /CAT_NAME_STYLE/);
    assert.match(homeR, /CAT_SUB_STYLE/);
    assert.match(homeR, /CAT_ARROW_STYLE/);
    assert.match(homeR, /CAT1_Y/);
    assert.match(homeR, /CAT2_Y/);
    assert.match(homeR, /CAT3_Y/);

    // START button
    assert.match(homeR, /START_BTN_STYLE/);
    assert.match(homeS, /START_BTN_STYLE/);

    // Bottom GUIDE / VIBRATION
    assert.match(homeR, /GUIDE_BTN_STYLE/);
    assert.match(homeR, /VIBRATION_BTN_STYLE/);

    // JS references category page navigation
    assert.match(home, /page\/category\/category/);

    // Uses CATEGORIES data
    assert.match(home, /CATEGORIES/);
  });

  it("complete page shows summary card with steps, duration, and weekly progress", () => {
    const complete = read("page/complete/complete.js");
    const completeR = read("page/complete/complete.r.layout.js");

    assert.match(completeR, /SUMMARY_CARD_STYLE/);
    assert.match(completeR, /SUMMARY_VALUE_1_STYLE/);
    assert.match(completeR, /SUMMARY_VALUE_2_STYLE/);
    assert.match(completeR, /SUMMARY_VALUE_3_STYLE/);

    // References Storage for weekly progress
    assert.match(complete, /COMPLETION_COUNT/);

    // No longer has standalone ICON
    assert.doesNotMatch(completeR, /ICON_STYLE/);
  });

  it("settings page uses calm fitness cards and direct vibration controls", () => {
    const settings = read("page/settings/settings.js");
    const settingsR = read("page/settings/settings.r.layout.js");
    const settingsS = read("page/settings/settings.s.layout.js");

    assert.match(settingsR, /OPTION_CARD_STYLE/);
    assert.match(settingsR, /MODE_SEGMENT_STYLE/);
    assert.match(settingsR, /MODE_SEGMENT_GAP/);
    assert.match(settingsS, /OPTION_CARD_STYLE/);
    assert.match(settingsS, /MODE_SEGMENT_STYLE/);

    assert.match(settings, /_selectMode/);
    assert.match(settings, /modeOptionTexts/);
    assert.doesNotMatch(settings, /btn_prev\.png/);
    assert.doesNotMatch(settings, /btn_next\.png/);
    assert.doesNotMatch(settings, /_cycleMode/);
  });

  it("complete page uses generated fitness badge assets and native-size HOME button", () => {
    const complete = read("page/complete/complete.js");
    const completeR = read("page/complete/complete.r.layout.js");
    const completeS = read("page/complete/complete.s.layout.js");

    assert.match(complete, /icon_complete\.png/);
    assert.match(complete, /icon_stop\.png/);
    assert.match(completeR, /RESULT_BADGE_STYLE/);
    assert.match(completeS, /RESULT_BADGE_STYLE/);
    assert.equal(pxValue(completeR, "HOME_BTN_STYLE", "w"), 140);
    assert.equal(pxValue(completeR, "HOME_BTN_STYLE", "h"), 55);
    assert.equal(pxValue(completeS, "HOME_BTN_STYLE", "w"), 140);
    assert.equal(pxValue(completeS, "HOME_BTN_STYLE", "h"), 55);
  });

  it("home layout elements do not overlap on round screen", () => {
    const layout = read("page/home/home.r.layout.js");
    const progressY = pxValue(layout, "PROGRESS_LABEL_STYLE", "y");
    const progressH = pxValue(layout, "PROGRESS_LABEL_STYLE", "h");
    const progressBottom = progressY + progressH;
    const cat1Y = exportedPxValue(layout, "CAT1_Y");
    const cat3Y = exportedPxValue(layout, "CAT3_Y");
    const catCardH = pxValue(layout, "CAT_CARD_STYLE", "h");
    const cat3Bottom = cat3Y + catCardH;
    const startY = pxValue(layout, "START_BTN_STYLE", "y");
    const startBottom = startY + pxValue(layout, "START_BTN_STYLE", "h");
    const guideY = pxValue(layout, "GUIDE_BTN_STYLE", "y");
    const guideH = pxValue(layout, "GUIDE_BTN_STYLE", "h");
    const guideBottom = guideY + guideH;
    const screenH = exportedPxValue(layout, "H");

    assert.ok(cat1Y - progressBottom >= 8, `progress-to-category gap too small: ${cat1Y - progressBottom}px`);
    assert.ok(startY - cat3Bottom >= 16, `category-to-start gap too small: ${startY - cat3Bottom}px`);
    assert.ok(guideY - startBottom >= 8, `start-to-guide gap too small: ${guideY - startBottom}px`);
    assert.ok(guideBottom < screenH, `guide bottom ${guideBottom} exceeds screen ${screenH}`);
  });

  it("keeps the round home layout inside the circular visible area", () => {
    const layout = read("page/home/home.r.layout.js");

    for (const styleName of [
      "PROGRESS_LABEL_STYLE",
      "PROGRESS_VALUE_STYLE",
      "PROGRESS_BG_STYLE",
      "START_BTN_STYLE",
      "GUIDE_BTN_STYLE",
      "VIBRATION_BTN_STYLE"
    ]) {
      assertRoundSafeRect(layout, styleName);
    }

    for (const y of [
      exportedPxValue(layout, "CAT1_Y"),
      exportedPxValue(layout, "CAT2_Y"),
      exportedPxValue(layout, "CAT3_Y")
    ]) {
      assertRoundSafeRect(layout, "CAT_CARD_STYLE", 8, y);
    }
  });

  it("keeps square home layout as a separate wide rectangular composition", () => {
    const layout = read("page/home/home.s.layout.js");
    const cardX = pxValue(layout, "CAT_CARD_STYLE", "x");
    const cardW = pxValue(layout, "CAT_CARD_STYLE", "w");
    const startX = pxValue(layout, "START_BTN_STYLE", "x");
    const startW = pxValue(layout, "START_BTN_STYLE", "w");

    assert.ok(cardX <= 24, `square category cards should use the square screen width, got x=${cardX}`);
    assert.ok(cardX + cardW >= 360, `square category cards are too narrow: ${cardX + cardW}px`);
    assert.ok(startX <= 24, `square START button should remain aligned to square margins, got x=${startX}`);
    assert.ok(startX + startW >= 360, `square START button is too narrow: ${startX + startW}px`);
  });

  it("removes the old loud orange UI accent from page layouts", () => {
    const layouts = [
      "page/category/category.r.layout.js",
      "page/category/category.s.layout.js",
      "page/mode-pick/mode-pick.r.layout.js",
      "page/mode-pick/mode-pick.s.layout.js",
      "page/session/session.r.layout.js",
      "page/session/session.s.layout.js"
    ];

    for (const relativePath of layouts) {
      assert.doesNotMatch(
        read(relativePath),
        /0xf48839/,
        `${relativePath} still uses the old orange accent instead of the calm fitness accent.`
      );
    }
  });
});
