import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIES } from "../data/categories.js";
import { SPORTS } from "../data/sports.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(path) {
  return readFileSync(join(ROOT, path), "utf8");
}

describe("category and mode-pick routing", () => {
  it("home category cards push to category page with categoryId from dynamic data", () => {
    const home = read("page/home/home.js");

    assert.match(home, /page\/category\/category/);
    assert.match(home, /categoryId/);
    assert.match(home, /cat\.id/);
  });

  it("category page filters sports by categoryId", () => {
    const source = read("page/category/category.js");

    assert.match(source, /getSportsByCategory/);
    assert.match(source, /categoryId/);
    assert.match(source, /parse\(options/);
  });

  it("each category page shows the correct number of sports", () => {
    for (const cat of CATEGORIES) {
      const sports = SPORTS.filter(s => s.categoryId === cat.id);
      assert.ok(sports.length === 4, `${cat.id} should have exactly 4 sports, got ${sports.length}`);
    }
  });

  it("mode-pick page receives sportId and renders two mode cards", () => {
    const source = read("page/mode-pick/mode-pick.js");

    assert.match(source, /sportId/);
    assert.match(source, /"quick"/);
    assert.match(source, /"full"/);
    assert.match(source, /page\/session\/session/);
  });

  it("mode-pick stores recentSportId before navigating to session", () => {
    const source = read("page/mode-pick/mode-pick.js");

    assert.match(source, /recentSportId/);
    assert.match(source, /Storage\.set/);
  });

  it("session passes complete params including sportId, routineType, totalSteps, totalDuration", () => {
    const source = read("page/session/session.js");

    assert.match(source, /sportId/);
    assert.match(source, /routineType/);
    assert.match(source, /totalSteps/);
    assert.match(source, /totalDuration/);
    assert.match(source, /_computeTotalDuration/);
  });

  it("category and mode-pick layouts use named alignment constants", () => {
    for (const page of ["category", "mode-pick"]) {
      for (const shape of ["r", "s"]) {
        const layout = read(`page/${page}/${page}.${shape}.layout.js`);
        const bareNumbers = layout.match(/align_h:\s*\d+/g);
        assert.ok(
          !bareNumbers || bareNumbers.length === 0,
          `${page}.${shape}.layout.js uses bare numeric alignment: ${bareNumbers}`
        );
      }
    }
  });
});
