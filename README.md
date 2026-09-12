 # eslint-config-efe13

CLI para configurar rápidamente ESLint + Prettier (Flat Config) o Biome en proyectos Next.js, Vite o backend-ts (Node/TypeScript).
 
 Reglas de configuración inspiradas en Goncy.



## Uso rápido

Ejecuta el CLI en la raíz de tu proyecto con tu gestor preferido:

```bash
npx eslint-config-efe13
# o
pnpm dlx eslint-config-efe13
# o
yarn dlx eslint-config-efe13
# o
bunx eslint-config-efe13
```

El CLI intentará detectar el framework automáticamente. Si no puede detectarlo (o es ambiguo), te pedirá que selecciones uno (`nextjs` | `vite` | `backend-ts`) y hará la configuración automáticamente.

Primero elige la herramienta:

- **ESLint + Prettier**: genera `eslint.config.mjs` e instala las dependencias del preset del framework.
- **Biome**: genera `biome.json` e instala `@biomejs/biome` (reemplaza ESLint + Prettier). No pregunta framework; usa el detectado para adaptar la config. En `backend-ts` omite los dominios de Next/React y las directivas de Tailwind.

En ambos casos agrega el script `"lint"` a `package.json` (`eslint .` o `biome check .`) si aún no existe.

### Nota para proyectos Vite

Si tu proyecto fue creado con Vite, elimina el archivo `eslint.config.js` que Vite genera por defecto. Este CLI creará `eslint.config.mjs` (Flat Config).

### Nota para proyectos backend-ts

- El preset usa [neostandard](https://github.com/neostandard/neostandard) (`ts: true`), el sucesor de `standard`/`semistandard` compatible con flat config y ESLint 9.
- Asegúrate de tener un `tsconfig.json` en la raíz del proyecto; el preset usa lint con información de tipos (`projectService`). Los archivos `.ts` sueltos de la raíz (`drizzle.config.ts`, `vitest.config.ts`, etc.) se lintan con el proyecto por defecto.
- El preset apunta a entornos Node.js y también habilita APIs de `serviceworker` (para soportar `fetch`, `Request`, `Response` en runtimes tipo Bun/Workers si fuese necesario).

## Requisitos

- Node.js 18+.
- Un gestor de paquetes: npm, pnpm, yarn o bun.

## ¿Qué hace?

- Detecta tu gestor de paquetes.
- Pregunta qué herramienta usar: ESLint + Prettier o Biome.
- Instala las dependencias necesarias.
- Genera `eslint.config.mjs` (Flat + Prettier) o `biome.json` según la herramienta.
- Añade el script `"lint"` (`eslint .` o `biome check .`) a `package.json` si existe y aún no define `lint`.

## Lint

```bash
npm run lint
```
## Licencia

ISC

