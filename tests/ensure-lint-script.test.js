import { describe, expect, it } from "vitest";

import { ensureLintScript } from "../src/ensure-lint-script.js";

describe("ensureLintScript", () => {
  it("agrega lint cuando no existe", () => {
    const pkg = {};

    expect(ensureLintScript(pkg)).toBe(true);
    expect(pkg.scripts.lint).toBe("eslint .");
  });

  it("conserva un script lint existente", () => {
    const pkg = { scripts: { lint: "eslint src" } };

    expect(ensureLintScript(pkg)).toBe(false);
    expect(pkg.scripts.lint).toBe("eslint src");
  });

  it("usa el script indicado cuando se pasa uno", () => {
    const pkg = {};

    expect(ensureLintScript(pkg, "biome check .")).toBe(true);
    expect(pkg.scripts.lint).toBe("biome check .");
  });
});
