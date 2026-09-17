import { execFileSync } from "node:child_process";
import { existsSync, watch } from "node:fs";
import { resolve, relative } from "node:path";

const root = resolve(import.meta.dirname, "..");
const ignoredDirectories = new Set([".git", "node_modules", ".vscode"]);
const debounceMs = 2000;
let syncTimer;
let syncing = false;

function runGit(args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

function hasChanges() {
  return runGit(["status", "--porcelain"]).length > 0;
}

function syncChanges() {
  if (syncing || !hasChanges()) {
    return;
  }

  syncing = true;
  try {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    runGit(["add", "-A"]);
    runGit(["commit", "-m", `Auto-sync: ${timestamp}`]);
    runGit(["push", "origin", "main"]);
    console.log(`[auto-push] Pushed changes at ${timestamp}`);
  } catch (error) {
    console.error("[auto-push] Sync failed. The next file change will retry.");
    console.error(error.stderr?.trim() || error.message);
  } finally {
    syncing = false;
  }
}

function shouldIgnore(filePath) {
  const firstSegment = relative(root, filePath).split(/[\\/]/)[0];
  return ignoredDirectories.has(firstSegment);
}

function scheduleSync(filePath) {
  if (shouldIgnore(filePath)) {
    return;
  }

  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncChanges, debounceMs);
}

if (!existsSync(resolve(root, ".git"))) {
  throw new Error("[auto-push] Git repository tidak ditemukan.");
}

watch(root, { recursive: true }, (_eventType, filename) => {
  if (filename) {
    scheduleSync(resolve(root, filename));
  }
});

console.log("[auto-push] Watching files. Changes will be committed and pushed after 2 seconds.");
scheduleSync(root);
