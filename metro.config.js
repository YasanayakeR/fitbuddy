const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude macOS resource fork files (starting with ._)
config.resolver.blockList = [
    /\._.*/,
];

module.exports = config;
