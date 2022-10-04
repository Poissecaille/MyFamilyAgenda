module.exports = {
    preset: "react-native",
    transform: {
        '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest'
    },
    transformIgnorePatterns: ['node_modules/(?!(@react-native|react-native|my-project|react-native-button|react-native-vector-icons|nodejs-mobile-react-native|react-navigation|react-native-iphone-x-helper)/)'],
    collectCoverage: true,
    moduleFileExtensions: [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ]
  }