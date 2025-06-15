module.exports = {
  presets: ["@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@": "./src",
        },
      },
    ],
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        blacklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
