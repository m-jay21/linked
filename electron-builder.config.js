module.exports = {
  appId: 'design.lost.linked',
  productName: 'linked',
  directories: {
    output: 'dist_electron',
    buildResources: 'build'
  },
  files: [
    'dist/**/*',
    'dist_electron/**/*',
    'package.json'
  ],
  asarUnpack: [
    'dist/**/*'
  ],
  extraMetadata: {
    main: 'dist_electron/background.js'
  },
  mac: {
    hardenedRuntime: true,
    entitlements: './build/entitlements.mac.inherit.plist',
    target: ['dmg', 'zip']
  },
  linux: {
    target: [
      'deb',
      'rpm',
      'pacman',
      'AppImage'
    ]
  },
  win: {
    icon: './build/icons/256x256.png',
    target: ['nsis', 'portable']
  },
  publish: {
    provider: 'github'
  },
  afterSign: './afterSignHook.js'
}

