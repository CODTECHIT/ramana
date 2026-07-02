#!/usr/bin/env node
import { execSync } from "child_process";

function getStagedFiles() {
  try {
    const out = execSync("git diff --cached --name-only", { encoding: "utf8" });
    return out.split(/\r?\n/).filter(Boolean);
  } catch (e) {
    console.error("Failed to list staged files:", e.message);
    process.exit(1);
  }
}

const blockedPatterns = [
  /^\.env$/i,
  /^server\/\.env$/i,
  /(^|\/)\.env(\.|$)/i, // any file that starts with .env (except .env.example)
];

const allowed = [/\.env\.example$/i, /\.env\.local\.example$/i];

const staged = getStagedFiles();
const offending = staged.filter((f) => {
  if (allowed.some((rx) => rx.test(f))) return false;
  return blockedPatterns.some((rx) => rx.test(f));
});

if (offending.length) {
  console.error(
    "\nERROR: Commit blocked — the following sensitive files are staged:",
  );
  offending.forEach((f) => console.error("  -", f));
  console.error(
    "\nRemove these files from the commit (git restore --staged <file>) or move secrets into environment stores.",
  );
  console.error("Keep example files like '.env.example' only.");
  process.exit(1);
}

process.exit(0);
