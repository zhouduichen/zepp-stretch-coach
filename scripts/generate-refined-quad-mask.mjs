import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const outputRoot = resolve("tmp/symbol-prototypes/refined-quad/svg");
mkdirSync(outputRoot, { recursive: true });

const frameCount = 24;
const sourcePath = resolve("tmp/symbol-prototypes/b-style/quad/f_0.png")
  .replaceAll("\\", "/");

function fixed(value) {
  return Number(value).toFixed(3);
}

function svgForFrame(frame) {
  const phase = (Math.PI * 2 * frame) / frameCount;
  const pulse = (Math.sin(phase) + 1) / 2;
  const widthScale = 1 + 0.045 * pulse;
  const baseOpacity = 0.34 + 0.34 * pulse;
  const coreOpacity = 0.22 + 0.46 * pulse;
  const centerStop = 0.45 + 0.08 * Math.sin(phase - Math.PI / 6);
  const leftStop = Math.max(0.20, centerStop - 0.18);
  const rightStop = Math.min(0.80, centerStop + 0.18);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="1280" height="960" viewBox="0 0 320 240">
  <defs>
    <linearGradient id="quadFill" x1="0.15" y1="0.05" x2="0.80" y2="0.95">
      <stop offset="0" stop-color="#ffc02a"/>
      <stop offset="0.48" stop-color="#ff971c"/>
      <stop offset="1" stop-color="#ff7418"/>
    </linearGradient>
    <linearGradient id="warmWave" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff8a18"/>
      <stop offset="${fixed(leftStop)}" stop-color="#ffa323"/>
      <stop offset="${fixed(centerStop)}" stop-color="#ffe271"/>
      <stop offset="${fixed(rightStop)}" stop-color="#ffa323"/>
      <stop offset="1" stop-color="#ff7618"/>
    </linearGradient>
    <linearGradient id="innerCore" x1="0.15" y1="0.1" x2="0.9" y2="0.95">
      <stop offset="0" stop-color="#fff08a"/>
      <stop offset="0.62" stop-color="#ffbd32"/>
      <stop offset="1" stop-color="#ff7c19"/>
    </linearGradient>
    <clipPath id="quadClip">
      <path d="M158.1 113.1
               C163.4 113.8, 166.7 118.4, 167.7 125.2
               C169.0 134.2, 168.2 143.0, 165.4 151.0
               C163.7 155.6, 161.5 158.8, 159.3 160.0
               C156.2 158.4, 154.3 154.4, 153.4 148.8
               C152.1 141.4, 152.2 133.2, 152.8 126.2
               C153.4 119.9, 155.0 115.5, 158.1 113.1 Z"/>
    </clipPath>
  </defs>

  <image x="0" y="0" width="320" height="240"
         href="file:///${sourcePath}" xlink:href="file:///${sourcePath}"/>

  <g clip-path="url(#quadClip)" transform="translate(160.5 136.5) scale(${fixed(widthScale)} 1) translate(-160.5 -136.5)">
    <path d="M158.1 113.1
             C163.4 113.8, 166.7 118.4, 167.7 125.2
             C169.0 134.2, 168.2 143.0, 165.4 151.0
             C163.7 155.6, 161.5 158.8, 159.3 160.0
             C156.2 158.4, 154.3 154.4, 153.4 148.8
             C152.1 141.4, 152.2 133.2, 152.8 126.2
             C153.4 119.9, 155.0 115.5, 158.1 113.1 Z"
          fill="url(#warmWave)" opacity="${fixed(baseOpacity)}"/>

    <path d="M159.1 116.5
             C162.1 119.8, 163.9 125.2, 164.6 131.7
             C165.3 138.2, 164.8 144.4, 163.1 149.7
             C162.1 152.8, 160.9 154.9, 159.6 156.0
             C158.1 153.6, 157.1 149.8, 156.7 145.0
             C156.2 138.7, 156.3 132.1, 156.7 126.4
             C157.0 121.8, 157.7 118.5, 159.1 116.5 Z"
          fill="url(#innerCore)" opacity="${fixed(coreOpacity)}"/>
  </g>
</svg>`;
}

for (let frame = 0; frame < frameCount; frame += 1) {
  writeFileSync(join(outputRoot, `f_${frame}.svg`), svgForFrame(frame), "utf8");
}

console.log(`Generated ${frameCount} refined quad-mask SVG frames in ${outputRoot}`);
