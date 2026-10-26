import { describe, expect, it } from "vitest";

import { generateOxfmtConfig, generateOxlintConfig } from "../src/generate-ox-config.js";

describe("generateOxlintConfig", () => {
  it("vite usa los plugins por defecto y las reglas del preset", () => {
    const config = JSON.parse(generateOxlintConfig("vite"));

    expect(config.plugins).toBeUndefined();
    expect(config.categories.correctness).toBe("error");
    expect(config.rules["no-console"]).toEqual(["warn", { allow: ["error"] }]);
    expect(config.rules["no-unused-vars"][1].argsIgnorePattern).toBe("^_.*?$");
    expect(config.ignorePatterns).toContain("dist");
  });

  it("nextjs activa el plugin nextjs y sus reglas", () => {
    const config = JSON.parse(generateOxlintConfig("nextjs"));

    expect(config.plugins).toContain("nextjs");
    expect(config.rules["nextjs/no-img-element"]).toBe("warn");
    expect(config.ignorePatterns).toContain(".next");
  });

  it("backend-ts es type-aware y sin reglas de Next", () => {
    const config = JSON.parse(generateOxlintConfig("backend-ts"));

    expect(config.options.typeAware).toBe(true);
    expect(config.plugins).toEqual(expect.arrayContaining(["import", "promise", "node"]));
    expect(config.rules["typescript/no-misused-promises"]).toEqual([
      "error",
      { checksVoidReturn: false },
    ]);
    expect(config.rules["no-unused-vars"][0]).toBe("warn");
    expect(Object.keys(config.rules).some((r) => r.startsWith("nextjs/"))).toBe(false);
  });

  it("no incluye reglas apagadas", () => {
    for (const fw of ["nextjs", "vite", "backend-ts"]) {
      const { rules } = JSON.parse(generateOxlintConfig(fw));
      expect(Object.values(rules).filter((v) => v === "off")).toEqual([]);
    }
  });
});

describe("generateOxfmtConfig", () => {
  it("ordena imports y clases de Tailwind en frontend", () => {
    const config = JSON.parse(generateOxfmtConfig("vite"));

    expect(config.printWidth).toBe(100);
    expect(config.sortImports.groups[0]).toBe("type");
    expect(config.sortTailwindcss).toBe(true);
  });

  it("omite Tailwind en backend-ts", () => {
    expect(JSON.parse(generateOxfmtConfig("backend-ts")).sortTailwindcss).toBeUndefined();
  });

  it("termina con salto de línea", () => {
    expect(generateOxfmtConfig("nextjs").endsWith("\n")).toBe(true);
    expect(generateOxlintConfig("nextjs").endsWith("\n")).toBe(true);
  });
});
