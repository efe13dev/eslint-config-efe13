import { generateOxfmtConfig, generateOxlintConfig } from "./generate-ox-config.js";

// Plugins que oxlint activa cuando la config no define "plugins".
const DEFAULT_PLUGINS = ["typescript", "unicorn", "oxc"];

const parse = (json) => {
  const { $schema, ...config } = JSON.parse(json);
  return config;
};
const union = (a = [], b = []) => [...new Set([...a, ...b])];

export function mergeLint(existing, framework) {
  const ours = parse(generateOxlintConfig(framework));

  return {
    ...existing,
    plugins: union(existing.plugins ?? DEFAULT_PLUGINS, ours.plugins ?? DEFAULT_PLUGINS),
    categories: { ...existing.categories, ...ours.categories },
    env: { ...existing.env, ...ours.env },
    ignorePatterns: union(existing.ignorePatterns, ours.ignorePatterns),
    rules: { ...existing.rules, ...ours.rules },
    options: { ...ours.options, ...existing.options },
  };
}

export function mergeFmt(existing, framework) {
  return { ...existing, ...parse(generateOxfmtConfig(framework)) };
}

export const toLiteral = (obj, indent = "  ") =>
  JSON.stringify(obj, null, 2).replaceAll("\n", `\n${indent}`);

// shortcut: cuenta llaves sin entender strings/comentarios; basta para el vite.config de `vp create`,
// si no cuadra el CLI imprime los bloques para pegarlos a mano.
function findBlock(source, key) {
  const match = new RegExp(`^([ \\t]*)${key}:\\s*\\{`, "m").exec(source);
  if (!match) return null;

  const start = match.index + match[0].length - 1;
  let depth = 0;

  for (let i = start; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return { start, end: i + 1, indent: match[1] };
  }

  return null;
}

/**
 * Mezcla las reglas y el formato ox en los bloques `lint` y `fmt` de un vite.config de Vite+.
 * Conserva lo que ya tenga el bloque (p.ej. reglas react de la plantilla) y gana lo nuestro.
 * @returns {string|null} el nuevo contenido, o null si no se pudo editar con seguridad.
 */
export function applyVitePlusConfig(source, framework) {
  let result = source;

  for (const [key, merge] of [
    ["lint", mergeLint],
    ["fmt", mergeFmt],
  ]) {
    const block = findBlock(result, key);
    let existing = {};

    if (block) {
      try {
        // El bloque es un literal de objeto JS (claves sin comillas, comas finales...).
        existing = new Function(`return (${result.slice(block.start, block.end)});`)();
      } catch {
        return null;
      }
    }

    const literal = toLiteral(merge(existing, framework), block?.indent ?? "  ");

    if (block) {
      result = result.slice(0, block.start) + literal + result.slice(block.end);
    } else {
      const anchor = "defineConfig({";
      const at = result.indexOf(anchor);
      if (at === -1) return null;

      const end = at + anchor.length;
      result = `${result.slice(0, end)}\n  ${key}: ${literal},${result.slice(end)}`;
    }
  }

  return result;
}
