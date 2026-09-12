#!/usr/bin/env node
import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import { createRequire } from "module";
import ora from "ora";

import { biomeDeps, depsByFramework } from "../src/deps.js";
import { detectFramework } from "../src/detect-framework.js";
import { detectPackageManager } from "../src/detect-package-manager.js";
import { ensureLintScript } from "../src/ensure-lint-script.js";
import { generateBiomeConfig } from "../src/generate-biome-config.js";
import { generateEslintConfig } from "../src/generate-config.js";

async function main() {
  console.log(chalk.bold.blue("\n🚀 Configurador de lint/formato\n"));

  const packageManager = detectPackageManager();
  console.log(chalk.green(`Detectado gestor de paquetes: ${packageManager}`));

  const { tool } = await inquirer.prompt({
    type: "list",
    name: "tool",
    message: "¿Qué herramienta quieres usar?",
    choices: [
      { name: "ESLint + Prettier", value: "eslint" },
      { name: "Biome", value: "biome" },
    ],
    default: "eslint",
  });

  const isBiome = tool === "biome";

  const detectedFramework = detectFramework();
  let framework = detectedFramework;

  if (framework) {
    console.log(chalk.green(`Framework detectado: ${framework}`));
  } else if (!isBiome) {
    const response = await inquirer.prompt({
      type: "list",
      name: "framework",
      message: "Selecciona el framework de tu proyecto",
      choices: ["nextjs", { name: "react-ts + vite", value: "vite" }, "backend-ts"],
      default: "nextjs",
    });
    framework = response.framework;
  }

  // Crear archivo de config (con confirmación si ya existe)
  const configPath = isBiome ? "biome.json" : "eslint.config.mjs";
  const configExists = fs.existsSync(configPath);

  if (configExists) {
    const { overwrite } = await inquirer.prompt({
      type: "confirm",
      name: "overwrite",
      message: `Ya existe ${configPath}. ¿Sobreescribir?`,
      default: false,
    });

    if (!overwrite) {
      console.log(chalk.yellow(`Se mantuvo el ${configPath} existente.`));
      return;
    }
  }

  const spinner = ora("Instalando dependencias...").start();

  try {
    const deps = isBiome ? biomeDeps : depsByFramework[framework];
    const installCmd =
      {
        npm: "npm install -D",
        pnpm: "pnpm add -D",
        bun: "bun add -d",
        yarn: "yarn add -D",
      }[packageManager] || "npm install -D";

    execSync(`${installCmd} ${deps.join(" ")}`, { stdio: "inherit" });
    spinner.succeed("Dependencias instaladas correctamente");
  } catch {
    spinner.fail("Error instalando dependencias");
    process.exit(1);
  }

  // overrides/resolutions del proyecto ganan al pin typescript@~6.0.0 y
  // typescript-eslint aborta con TS 7 — avisar si quedó instalado TS >= 7.
  // Solo aplica a la ruta ESLint: Biome no usa typescript-eslint.
  if (!isBiome) {
    try {
      const req = createRequire(`${process.cwd()}/package.json`);
      const tsVersion = req("typescript/package.json").version;

      if (Number(tsVersion.split(".")[0]) >= 7) {
        console.warn(
          chalk.yellow(
            `\nAviso: quedó instalado typescript@${tsVersion} y typescript-eslint no soporta TS 7 — el lint abortará.\n` +
              `Revisa "overrides"/"resolutions" en tu package.json (o en el root si es monorepo) y quita el pin a TS 7.`,
          ),
        );
      }
    } catch {
      // typescript no resolvible desde el proyecto — nada que avisar
    }
  }

  try {
    fs.writeFileSync(
      configPath,
      isBiome ? generateBiomeConfig(framework) : generateEslintConfig(framework),
    );
    console.log(
      chalk.green(`Archivo ${configPath} ${configExists ? "sobreescrito" : "creado"} con éxito`),
    );
  } catch {
    console.error(chalk.red(`Error creando el archivo ${configPath}`));
    process.exit(1);
  }

  // Añadir script lint a package.json
  try {
    const pkgPath = "package.json";
    if (!fs.existsSync(pkgPath)) {
      console.warn(chalk.yellow("No se encontró package.json, no se agregó script lint."));
    } else {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

      if (ensureLintScript(pkg, isBiome ? "biome check ." : "eslint .")) {
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        console.log(chalk.green("Script 'lint' agregado a package.json"));
      } else {
        console.log(chalk.yellow("Se mantuvo el script 'lint' existente."));
      }
    }
  } catch {
    console.warn(chalk.yellow("No se pudo modificar package.json para añadir el script lint."));
  }

  console.log(chalk.bold.blue("\n🎉 ¡Configuración completada con éxito!\n"));
}

main();
