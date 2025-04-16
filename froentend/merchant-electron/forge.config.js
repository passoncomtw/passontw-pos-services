const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        devContentSecurityPolicy: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.tsx',
              name: 'main_window',
              preload: {
                js: './src/preload.ts',
              },
            },
          ],
        },
        port: 3000,
        loggerPort: 9000,
      },
    },
    {
      name: '@electron-forge/plugin-fuses',
      config: {
        version: 1,
        fuses: [
          // Setup fuse-native-run-as-node
          {
            name: 'native-run-as-node',
            version: 1,
            state: 'disabled',
          },
          // Setup fuse-v8-snapshot
          {
            name: 'v8-snapshot',
            version: 1,
            state: 'disabled',
          },
          // Setup fuse-external-snapshot
          {
            name: 'external-snapshot',
            version: 1,
            state: 'disabled',
          },
        ],
      },
    },
  ],
};
