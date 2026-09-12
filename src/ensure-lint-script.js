export function ensureLintScript(pkg, script = "eslint .") {
  pkg.scripts ||= {};
  if (Object.hasOwn(pkg.scripts, "lint")) return false;

  pkg.scripts.lint = script;
  return true;
}
