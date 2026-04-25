const { execSync } = require("node:child_process");
const path = require("node:path");

const root = path.join(__dirname, "..");
const tsc = path.join(root, "node_modules", "typescript", "lib", "tsc.js");
const vite = path.join(root, "node_modules", "vite", "bin", "vite.js");

try {
  execSync(`node "${tsc}" --noEmit`, { stdio: "inherit", cwd: root });
  execSync(`node "${vite}" build`, { stdio: "inherit", cwd: root });
} catch (e) {
  console.error(e?.message ?? e);
  process.exit(1);
}
