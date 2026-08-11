const path = require('node:path');

/**
 * Babel config for the mobile app.
 *
 * `babel-preset-expo` is what rewrites the `require.context` in expo-router's
 * entry into a real scan of `app/`. Without it Metro leaves the call
 * untransformed and the bundle dies with "First argument of require.context
 * should be a string".
 *
 * The preset only enables that plugin when it can `require.resolve`
 * 'expo-router' *from its own location*. In this workspace it cannot: the web
 * app pins React 19 and Expo SDK 52 pins React 18.3.1, so npm hoists
 * babel-preset-expo to the workspace root while nesting the whole React Native
 * tree — expo-router included — under apps/mobile. The preset sits in one tree
 * and looks for a package that lives in the other, finds nothing, and silently
 * skips the plugin.
 *
 * So we add the plugin ourselves, but only when the preset demonstrably will
 * not: if a future dependency change makes expo-router resolvable from the
 * preset, this becomes a no-op rather than a double application.
 */
function presetWillAddRouterPlugin() {
  try {
    const presetPath = require.resolve('babel-preset-expo');
    require.resolve('expo-router', { paths: [path.dirname(presetPath)] });
    return true;
  } catch {
    return false;
  }
}

module.exports = function babelConfig(api) {
  api.cache(true);

  const plugins = [];
  if (!presetWillAddRouterPlugin()) {
    const { expoRouterBabelPlugin } = require('babel-preset-expo/build/expo-router-plugin');
    plugins.push(expoRouterBabelPlugin);
  }

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
