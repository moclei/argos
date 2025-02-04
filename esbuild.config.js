const esbuild = require("esbuild");

// Common options
const commonOptions = {
  bundle: true,
  platform: "browser",
  sourcemap: true,
  external: ["webextension-polyfill"],
};

async function build() {
  try {
    // Build CJS
    esbuild
      .build({
        ...commonOptions,
        entryPoints: ["src/index.ts"],
        format: "cjs",
        outfile: "dist/index.js",
      })
      .catch(() => process.exit(1));

    // Build ESM
    esbuild.build({
      ...commonOptions,
      entryPoints: ["src/index.ts"],
      format: "esm",
      outfile: "dist/index.esm.js",
    });

    // Build frame monitor content script
    await esbuild.build({
      ...commonOptions,
      entryPoints: ["src/content-scripts/frame-monitor.ts"],
      format: "iife", // Use IIFE for content scripts
      outfile: "dist/content-scripts/frame-monitor.js",
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

build();
