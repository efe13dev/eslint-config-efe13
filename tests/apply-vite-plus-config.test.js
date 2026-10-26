import { describe, expect, it } from "vitest";

import { applyVitePlusConfig } from "../src/apply-vite-plus-config.js";

// vite.config.ts que genera `vp create vite -- --template react-ts`.
const TEMPLATE = `import react from '@vitejs/plugin-react'
import { defineConfig, lazyPlugins } from 'vite-plus'

export default defineConfig({
  fmt: {},
  lint: {
    "plugins": ["react", "typescript", "oxc"],
    "rules": {
      "react/rules-of-hooks": "error",
      "vite-plus/prefer-vite-plus-imports": "error"
    },
    "options": { "typeAware": true, "typeCheck": true },
    "jsPlugins": [{ "name": "vite-plus", "specifier": "vite-plus/oxlint-plugin" }]
  },
  plugins: lazyPlugins(() => [react()]),
})
`;

const loadConfig = (source) =>
  new Function(
    "defineConfig",
    "lazyPlugins",
    "react",
    source.replace(/^import.*$/gm, "").replace("export default", "return"),
  )((c) => c, () => [], () => null);

describe("applyVitePlusConfig", () => {
  it("mezcla las reglas con las de la plantilla y rellena fmt", () => {
    const { lint, fmt } = loadConfig(applyVitePlusConfig(TEMPLATE, "vite"));

    expect(lint.rules["react/rules-of-hooks"]).toBe("error");
    expect(lint.rules["vite-plus/prefer-vite-plus-imports"]).toBe("error");
    expect(lint.rules["no-console"]).toEqual(["warn", { allow: ["error"] }]);
    expect(lint.plugins).toEqual(["react", "typescript", "oxc", "unicorn"]);
    expect(lint.categories.correctness).toBe("error");
    expect(lint.options).toEqual({ typeAware: true, typeCheck: true });
    expect(lint.jsPlugins).toHaveLength(1);
    expect(lint.$schema).toBeUndefined();
    expect(fmt.sortTailwindcss).toBe(true);
    expect(fmt.printWidth).toBe(100);
  });

  it("es idempotente", () => {
    const once = applyVitePlusConfig(TEMPLATE, "vite");

    expect(applyVitePlusConfig(once, "vite")).toBe(once);
  });

  it("añade los bloques si no existen", () => {
    const source = `import { defineConfig } from "vite-plus";\n\nexport default defineConfig({\n  plugins: [],\n});\n`;
    const { lint, fmt, plugins } = loadConfig(applyVitePlusConfig(source, "vite"));

    expect(lint.rules["no-var"]).toBe("error");
    expect(fmt.semi).toBe(true);
    expect(plugins).toEqual([]);
  });

  it("devuelve null si el bloque no es un literal evaluable", () => {
    const source = `export default defineConfig({\n  lint: { rules: myRules },\n});\n`;

    expect(applyVitePlusConfig(source, "vite")).toBeNull();
  });
});
