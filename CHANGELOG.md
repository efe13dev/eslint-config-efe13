# Changelog

Todas las notas de cambios para `eslint-config-efe13`.

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
