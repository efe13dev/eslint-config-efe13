const SCHEMA = "https://biomejs.dev/schemas/2.5.13/schema.json";

// Bloques que solo aplican a frontend (Next/React + Tailwind).
const CSS_BLOCK = `  "css": {
    "parser": { "tailwindDirectives": true }
  },
`;
const DOMAINS_LINE = `    "domains": { "next": "recommended", "react": "recommended" },
`;

/**
 * Genera el contenido de biome.json para el framework dado.
 * backend-ts omite los dominios de Next/React y las directivas de Tailwind.
 * El formato coincide con el del propio formateador de Biome (lineWidth 100,
 * arrays inline), así `biome check` no marca biome.json como mal formateado.
 * @param {"nextjs"|"vite"|"backend-ts"|null} framework
 * @returns {string}
 */
export function generateBiomeConfig(framework) {
  const isBackend = framework === "backend-ts";

  return `{
  "$schema": "${SCHEMA}",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": {
    "ignoreUnknown": false,
    "includes": ["**", "!node_modules", "!.next", "!out", "!coverage", "!.idea"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "auto"
  },
${isBackend ? "" : CSS_BLOCK}  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all",
      "arrowParentheses": "always",
      "bracketSpacing": true
    }
  },
  "linter": {
    "enabled": true,
${isBackend ? "" : DOMAINS_LINE}    "rules": {
      "preset": "recommended",
      "nursery": {
        "useSortedClasses": {
          "level": "warn",
          "options": { "functions": ["cn", "cva", "clsx"] }
        }
      },
      "correctness": {
        "noUnusedVariables": {
          "level": "warn",
          "options": { "ignore": { "variable": ["_*"], "function": ["_*"] } }
        }
      },
      "suspicious": {
        "noConsole": { "level": "warn", "options": { "allow": ["error"] } },
        "noEmptyBlockStatements": "off",
        "noExplicitAny": "off",
        "noTsIgnore": "off"
      },
      "style": {
        "noInferrableTypes": "off",
        "noNamespace": "off",
        "noNonNullAssertion": "off"
      }
    }
  },
  "assist": {
    "enabled": true,
    "actions": { "source": { "organizeImports": "on" } }
  }
}
`;
}
