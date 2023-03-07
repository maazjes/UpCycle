const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.watchFolders.push(path.resolve(`${__dirname}/../shared`))

module.exports = config;
