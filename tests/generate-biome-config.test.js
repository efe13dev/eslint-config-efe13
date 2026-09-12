import { describe, expect, it } from "vitest";

import { generateBiomeConfig } from "../src/generate-biome-config.js";

describe("generateBiomeConfig", () => {
  it("genera JSON válido con las reglas esperadas", () => {
    const config = JSON.parse(generateBiomeConfig("nextjs"));

    expect(config.$schema).toContain("biomejs.dev/schemas");
    expect(config.linter.domains).toEqual({ next: "recommended", react: "recommended" });
    expect(config.linter.rules.suspicious.noConsole).toEqual({
      level: "warn",
      options: { allow: ["error"] },
    });
    expect(config.linter.rules.style.noNonNullAssertion).toBe("off");
    expect(config.assist.actions.source.organizeImports).toBe("on");
    expect(config.formatter.lineWidth).toBe(100);
  });

  it("incluye Tailwind en frontend", () => {
    expect(JSON.parse(generateBiomeConfig("vite")).css.parser.tailwindDirectives).toBe(true);
  });

  it("omite dominios next/react y Tailwind en backend-ts", () => {
    const config = JSON.parse(generateBiomeConfig("backend-ts"));

    expect(config.linter.domains).toBeUndefined();
    expect(config.css).toBeUndefined();
    expect(config.linter.rules.preset).toBe("recommended");
  });

  it("genera el contenido como string con salto de línea final", () => {
    const config = generateBiomeConfig("nextjs");
    expect(typeof config).toBe("string");
    expect(config.endsWith("\n")).toBe(true);
  });
});
