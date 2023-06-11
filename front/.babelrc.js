module.exports = function (api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@shared': '../shared',
            'views': './src/views',
            'components': './src/components',
            'navigation': './src/navigation',
            'services': './src/services',
            'hooks': './src/hooks',
            'styles': './src/styles',
            'util': './src/util',
            'types': './src/types',
            'reducers': './src/reducers',
            'assets': './assets'
          },
        }
      ],
      [
        "module:react-native-dotenv",
        {
            moduleName: "@env",
            path: ".env",
        },
      ]
    ]
  };
};