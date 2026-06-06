/**
 * Tests for generated animation visual scale.
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function readPngRgba(path) {
  const data = readFileSync(path);
  assert.equal(data.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", `${path} is not a PNG`);

  let offset = 8;
  let width = 0;
  let height = 0;
  const idat = [];

  while (offset < data.length) {
    const length = data.readUInt32BE(offset);
    const type = data.subarray(offset + 4, offset + 8).toString("ascii");
    const chunk = data.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      assert.equal(chunk[8], 8, `${path} must use 8-bit PNG channels`);
      assert.equal(chunk[9], 6, `${path} must use RGBA PNG color type`);
    } else if (type === "IDAT") {
      idat.push(chunk);
    } else if (type === "IEND") {
      break;
    }
    offset += 12 + length;
  }

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const pixels = Buffer.alloc(height * stride);
  let rawOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = raw[rawOffset];
    rawOffset += 1;
    const row = raw.subarray(rawOffset, rawOffset + stride);
    rawOffset += stride;
    const outOffset = y * stride;

    for (let x = 0; x < stride; x += 1) {
      const left = x >= 4 ? pixels[outOffset + x - 4] : 0;
      const up = y > 0 ? pixels[outOffset - stride + x] : 0;
      const upLeft = x >= 4 && y > 0 ? pixels[outOffset - stride + x - 4] : 0;
      let value;
      if (filter === 0) {
        value = row[x];
      } else if (filter === 1) {
        value = row[x] + left;
      } else if (filter === 2) {
        value = row[x] + up;
      } else if (filter === 3) {
        value = row[x] + Math.floor((left + up) / 2);
      } else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        const predictor = pa <= pb && pa <= pc ? left : (pb <= pc ? up : upLeft);
        value = row[x] + predictor;
      } else {
        throw new Error(`${path} uses unsupported PNG filter ${filter}`);
      }
      pixels[outOffset + x] = value & 0xff;
    }
  }

  return { width, height, pixels };
}

function alphaBounds(path) {
  const image = readPngRgba(path);
  let minX = image.width;
  let minY = image.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const alpha = image.pixels[((y * image.width + x) * 4) + 3];
      if (alpha > 5) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  assert.ok(maxX >= minX && maxY >= minY, `${path} has no visible pixels`);
  return {
    w: maxX - minX + 1,
    h: maxY - minY + 1
  };
}

describe("animation visual scale", () => {
  it("keeps wide and narrow B-style poses at comparable visual sizes", () => {
    const sideLunge = alphaBounds(join(ROOT, "assets", "gt.r", "animations", "sidelunge", "f_0.png"));
    const legSwing = alphaBounds(join(ROOT, "assets", "gt.r", "animations", "legswing", "f_0.png"));

    const ratio = (sideLunge.w * sideLunge.h) / (legSwing.w * legSwing.h);
    assert.ok(
      ratio <= 1.6,
      `sidelunge visible area is ${ratio.toFixed(2)}x legswing; generated frames should normalize pose scale`
    );
  });
});
