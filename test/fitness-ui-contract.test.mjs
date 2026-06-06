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
