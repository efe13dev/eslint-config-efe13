# Changelog

Todas las notas de cambios para `eslint-config-efe13`.

## [1.2.1] - 2026-09-10

- fix: Pinea `typescript@~6.0.0` en todos los presets — `typescript-eslint` soporta `>=4.8.4 <6.1.0` y con `typescript@7` abortaba antes de evaluar cualquier regla (`npm run lint` y `--print-config` fallaban sin producir configuración).
- feat: Instala `@typescript/native-preview` en todos los presets — `tsgo` (compilador nativo de TS 7) queda disponible para builds/typechecks rápidos mientras `typescript-eslint` no soporta TS 7.

## [1.2.0] - 2026-09-10

- fix(backend-ts): Reemplaza `eslint-config-semistandard` por `neostandard`. Semistandard es config eslintrc legacy: su peer `eslint ^8` rompía la instalación con npm (`ERESOLVE` contra ESLint 9) y sus `.rules` solo contenían `semi`/`no-extra-semi`, con lo que el ruleset Standard nunca se aplicaba en flat config.
- fix(backend-ts): Usa `parserOptions.projectService` con `allowDefaultProject` en lugar de `project`, para que archivos TS fuera del `include` del tsconfig (`drizzle.config.ts`, `vitest.config.ts`, etc.) no rompan el lint.
- fix(backend-ts): `tsconfigRootDir` anclado al propio `eslint.config.mjs` (`import.meta`) en lugar de `process.cwd()`.
- feat(backend-ts): Se lintan también archivos `.mts`, `.cts` y `.tsx`.
- chore(backend-ts): Desactiva `n/process-exit-as-throw` (queda cubierto por `n/no-process-exit: warn`; `process.exit()` es válido en scripts/CLIs).
- chore(backend-ts): Reduce las dependencias instaladas — `eslint-plugin-n`, `eslint-plugin-promise`, `globals` y `typescript-eslint` vienen incluidos en `neostandard`.
- fix: Instala `eslint@^9` en todos los presets — `neostandard`, `eslint-plugin-import`, `eslint-plugin-react` y `eslint-plugin-jsx-a11y` aún no declaran soporte para ESLint 10 (evita resoluciones rotas en pnpm/bun/yarn).

## [1.1.4] - 2026-09-09

- chore: Renombra el paquete a `eslint-config-efe13`.
- fix: Solicita confirmación antes de instalar dependencias cuando ya existe `eslint.config.mjs`.
- fix: Conserva el script `lint` existente en `package.json`.
- chore: Actualiza dependencias compatibles y corrige las vulnerabilidades reportadas por npm.
- test: Cubre la creación y conservación del script `lint`.

## [1.1.0] - 2025-08-15

- feat: Agrega preset `backend-ts` (Node/TypeScript) con reglas: @typescript-eslint, import, n, promise, semistandard y Prettier integrados (Flat Config).
- chore: Añade `globals` como dependencia en presets `nextjs` y `vite` para alinear con `import globals from "globals"` en las plantillas.
- docs: Actualiza README para incluir `backend-ts` y nota sobre `tsconfig.json`.
- chore: Bump de versión a 1.1.0.

Crédito: reglas inspiradas en el trabajo de Goncy.

---

Formato sugerido: Keep a Changelog (resumen breve por versión).
