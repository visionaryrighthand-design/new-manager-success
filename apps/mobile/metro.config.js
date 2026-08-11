// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the whole workspace so edits to @nms/content or @nms/core
// hot-reload in the app instead of needing a restart.
config.watchFolders = [workspaceRoot];

// Resolve from the app first, then the hoisted workspace root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// npm workspaces hoist, so a package can otherwise be resolved twice and React
// ends up duplicated — which surfaces as invalid-hook-call errors that look
// nothing like their cause.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
