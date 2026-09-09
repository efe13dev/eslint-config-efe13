export function ensureLintScript(pkg) {
  pkg.scripts ||= {};
  if (Object.hasOwn(pkg.scripts, "lint")) return false;

  pkg.scripts.lint = "eslint .";
  return true;
}
