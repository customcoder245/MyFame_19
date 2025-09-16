module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
          root: ["."],
          alias: {
            "@components": "./src/Components",
            "@screens": "./src/screens",
            "@assets": "./assets",
            "@constants": "./src/constants",
            "@services": "./src/services",
            "@hooks": "./src/Hooks",
          },
        },
      ],
      "react-native-reanimated/plugin",
      // 'react-native-paper/babel'
    ],
  };
};
