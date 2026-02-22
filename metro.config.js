const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Zustand v5 ships ESM files that use import.meta.env.
// The web bundle is loaded via a classic <script> tag (no type="module"),
// so import.meta causes a SyntaxError and a white screen.
// Force Metro to resolve Zustand subpaths to CJS versions.
const originalResolveRequest = config.resolver?.resolveRequest;

config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Redirect zustand ESM subpath imports to CJS
    if (
      platform === "web" &&
      moduleName.startsWith("zustand/") &&
      !moduleName.endsWith(".js")
    ) {
      const subpath = moduleName.replace("zustand/", "");
      const cjsPath = path.resolve(
        __dirname,
        "node_modules",
        "zustand",
        subpath + ".js"
      );
      return { type: "sourceFile", filePath: cjsPath };
    }
    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
