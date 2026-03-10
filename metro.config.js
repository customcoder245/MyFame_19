// /**
//  * Metro configuration for React Native
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// const path = require('path');

// module.exports = {
//   projectRoot: path.resolve(__dirname),
//   watchFolders: [
//     path.resolve(__dirname, 'node_modules'),
//   ],
//   resolver: {
//     assetExts: ['db', 'mp3', 'sqlite'],
//     sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'svg'],
//   },
// };



// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
