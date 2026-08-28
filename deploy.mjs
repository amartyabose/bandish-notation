import { copyFileSync, mkdirSync, existsSync } from "fs";
import { execSync } from "child_process";

const vaultPluginDir = process.env.OBSIDIAN_VAULT_PLUGIN_DIR;
if (!vaultPluginDir) {
	console.error("Set OBSIDIAN_VAULT_PLUGIN_DIR to your vault's .obsidian/plugins/bandish-notation path.");
	process.exit(1);
}

console.log("Building...");
execSync("node esbuild.config.mjs production", { stdio: "inherit" });

if (!existsSync(vaultPluginDir)) {
	mkdirSync(vaultPluginDir, { recursive: true });
}

for (const file of ["manifest.json", "main.js", "styles.css"]) {
	copyFileSync(file, `${vaultPluginDir}/${file}`);
	console.log(`Copied ${file}`);
}

console.log("Deployed.");
