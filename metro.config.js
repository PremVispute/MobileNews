const { getDefaultConfig } = require("@expo/metro-config");

const configs = getDefaultConfig(__dirname);
configs.resolver.assetExts.push("csv");

module.exports = configs;
