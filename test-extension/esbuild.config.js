const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

// Copy manifest and other static files
function copyPublicFiles() {
  console.log("Copying public files");
  fs.cpSync(path.join(__dirname, "public"), path.join(__dirname, "dist"), {
    recursive: true,
  });
}

// Common build options
const commonOptions = {
  bundle: true,
  minify: false,
  sourcemap: true,
  platform: "browser",
  define: {
    "process.env.NODE_ENV": '"development"',
  },
};

// Build background script
esbuild
  .build({
    ...commonOptions,
    entryPoints: ["src/background.ts"],
    outfile: "dist/background.js",
  })
  .catch(() => process.exit(1));

// Build popup
esbuild
  .build({
    ...commonOptions,
    entryPoints: ["src/popup/popup.tsx"],
    outfile: "dist/popup.js",
  })
  .catch(() => process.exit(1));

// Copy static files
copyPublicFiles();
