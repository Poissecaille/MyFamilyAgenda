/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  resolver: {
    /* resolver options */
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs'], //add here 
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};