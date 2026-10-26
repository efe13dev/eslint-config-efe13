const OXLINT_SCHEMA = "./node_modules/oxlint/configuration_schema.json";
const OXFMT_SCHEMA = "./node_modules/oxfmt/configuration_schema.json";

const IGNORES = ["node_modules", "dist", "coverage", ".idea"];

// Solo reglas fuera de `correctness` (activa como error) o con opciones propias:
// las de `correctness` ya se aplican y los "off" de categorías inactivas sobran.
const FRONTEND_RULES = {
  "no-array-constructor": "error",
  "no-console": ["warn", { allow: ["error"] }],
  "no-unused-vars": [
    "warn",
    { args: "after-used", argsIgnorePattern: "^_.*?$", caughtErrorsIgnorePattern: "^_.*?$" },
  ],
  "no-var": "error",
  "prefer-const": "error",
  "prefer-rest-params": "error",
  "prefer-spread": "error",
  "typescript/no-empty-object-type": "error",
  "typescript/no-require-imports": "error",
  "typescript/no-unnecessary-type-constraint": "error",
  "typescript/no-unsafe-function-type": "error",
};

// @next/eslint-plugin-next core-web-vitals con sus severidades.
const NEXT_RULES = {
  "nextjs/google-font-display": "warn",
  "nextjs/google-font-preconnect": "warn",
  "nextjs/next-script-for-ga": "warn",
  "nextjs/no-async-client-component": "warn",
  "nextjs/no-before-interactive-script-outside-document": "warn",
  "nextjs/no-css-tags": "warn",
  "nextjs/no-head-element": "warn",
  "nextjs/no-img-element": "warn",
  "nextjs/no-page-custom-font": "warn",
  "nextjs/no-styled-jsx-in-document": "warn",
  "nextjs/no-title-in-document-head": "warn",
  "nextjs/no-typos": "warn",
  "nextjs/no-unwanted-polyfillio": "warn",
};

// neostandard + reglas del proyecto, convertidas con @oxlint/migrate.
const BACKEND_RULES = {
  "no-var": "warn",
  "object-shorthand": [
    "warn",
    "properties"
  ],
  "accessor-pairs": [
    "error",
    {
      "setWithoutGet": true,
      "enforceForClassMembers": true
    }
  ],
  "array-callback-return": [
    "error",
    {
      "allowImplicit": false,
      "checkForEach": false
    }
  ],
  "default-case-last": "error",
  "eqeqeq": [
    "error",
    "always",
    {
      "null": "ignore"
    }
  ],
  "new-cap": [
    "error",
    {
      "newIsCap": true,
      "capIsNew": false,
      "properties": true
    }
  ],
  "no-array-constructor": "error",
  "no-case-declarations": "error",
  "no-constant-condition": [
    "error",
    {
      "checkLoops": false
    }
  ],
  "no-empty": [
    "error",
    {
      "allowEmptyCatch": true
    }
  ],
  "no-extend-native": "error",
  "no-extra-bind": "error",
  "no-fallthrough": "error",
  "no-implied-eval": "error",
  "no-labels": [
    "error",
    {
      "allowLoop": false,
      "allowSwitch": false
    }
  ],
  "no-lone-blocks": "error",
  "no-prototype-builtins": "error",
  "no-multi-str": "error",
  "no-new": "error",
  "no-new-func": "error",
  "no-object-constructor": "error",
  "no-new-wrappers": "error",
  "no-proto": "error",
  "no-redeclare": [
    "error",
    {
      "builtinGlobals": false
    }
  ],
  "no-regex-spaces": "error",
  "no-return-assign": [
    "error",
    "except-parens"
  ],
  "no-self-assign": [
    "error",
    {
      "props": true
    }
  ],
  "no-self-compare": "error",
  "no-sequences": "error",
  "no-template-curly-in-string": "error",
  "no-throw-literal": "error",
  "no-unmodified-loop-condition": "error",
  "no-unneeded-ternary": [
    "error",
    {
      "defaultAssignment": false
    }
  ],
  "no-unused-expressions": [
    "error",
    {
      "allowShortCircuit": true,
      "allowTernary": true,
      "allowTaggedTemplates": true
    }
  ],
  "no-unused-vars": [
    "warn",
    {
      "args": "after-used",
      "argsIgnorePattern": "^_.*?$",
      "caughtErrorsIgnorePattern": "^_.*?$"
    }
  ],
  "no-use-before-define": [
    "error",
    {
      "functions": false,
      "classes": false,
      "variables": false
    }
  ],
  "no-useless-call": "error",
  "no-useless-computed-key": "error",
  "no-useless-constructor": "error",
  "no-useless-return": "error",
  "no-void": "error",
  "one-var": [
    "error",
    {
      "initialized": "never"
    }
  ],
  "prefer-const": [
    "error",
    {
      "destructuring": "all"
    }
  ],
  "prefer-promise-reject-errors": "error",
  "prefer-regex-literals": [
    "error",
    {
      "disallowRedundantWrapping": true
    }
  ],
  "symbol-description": "error",
  "unicode-bom": [
    "error",
    "never"
  ],
  "use-isnan": [
    "error",
    {
      "enforceForSwitchCase": true,
      "enforceForIndexOf": true
    }
  ],
  "valid-typeof": [
    "error",
    {
      "requireStringLiterals": true
    }
  ],
  "yoda": [
    "error",
    "never"
  ],
  "promise/param-names": "error",
  "node/handle-callback-err": [
    "error",
    "^(err|error)$"
  ],
  "node/no-exports-assign": "error",
  "node/no-new-require": "error",
  "node/no-path-concat": "error",
  "no-console": [
    "warn",
    {
      "allow": [
        "error"
      ]
    }
  ],
  "import/no-duplicates": "warn",
  "import/newline-after-import": [
    "warn",
    {
      "count": 1
    }
  ],
  "promise/no-return-wrap": "error",
  "typescript/consistent-type-imports": [
    "warn",
    {
      "prefer": "type-imports"
    }
  ],
  "typescript/no-misused-promises": [
    "error",
    {
      "checksVoidReturn": false
    }
  ]
};

/**
 * Genera el contenido de .oxlintrc.json para el framework dado.
 * @param {"nextjs"|"vite"|"backend-ts"} framework
 * @returns {string}
 */
export function generateOxlintConfig(framework) {
  const config = { $schema: OXLINT_SCHEMA };

  if (framework === "backend-ts") {
    Object.assign(config, {
      plugins: ["typescript", "unicorn", "oxc", "import", "promise", "node"],
      categories: { correctness: "error" },
      env: { node: true, serviceworker: true },
      options: { typeAware: true },
      ignorePatterns: IGNORES,
      rules: BACKEND_RULES,
    });
  } else {
    const isNext = framework === "nextjs";

    Object.assign(config, {
      ...(isNext && { plugins: ["typescript", "unicorn", "oxc", "nextjs"] }),
      categories: { correctness: "error" },
      env: { browser: true, node: true, serviceworker: true },
      ignorePatterns: isNext ? ["node_modules", ".next", "out", "coverage", ".idea"] : IGNORES,
      rules: isNext ? { ...FRONTEND_RULES, ...NEXT_RULES } : FRONTEND_RULES,
    });
  }

  return `${JSON.stringify(config, null, 2)}\n`;
}

/**
 * Genera el contenido de .oxfmtrc.json (mismo estilo que el Prettier de los presets ESLint).
 * Sustituye a import/order (sortImports) y a prettier-plugin-tailwindcss (sortTailwindcss).
 * @param {"nextjs"|"vite"|"backend-ts"} framework
 * @returns {string}
 */
export function generateOxfmtConfig(framework) {
  const config = {
    $schema: OXFMT_SCHEMA,
    printWidth: 100,
    trailingComma: "all",
    tabWidth: 2,
    semi: true,
    singleQuote: false,
    bracketSpacing: true,
    arrowParens: "always",
    sortImports: {
      groups: [
        "type",
        "builtin",
        "external",
        ["internal", "subpath"],
        "parent",
        "sibling",
        "index",
        "style",
        "unknown",
      ],
    },
    ...(framework !== "backend-ts" && { sortTailwindcss: true }),
  };

  return `${JSON.stringify(config, null, 2)}\n`;
}
