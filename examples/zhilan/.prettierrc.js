module.exports = {
  useTabs: false,
  tabWidth: 2,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  printWidth: 100,
  proseWrap: 'never',
  endOfLine: 'lf',
  overrides: [
    {
      files: 'document.ejs',
      options: {
        parser: 'html',
      },
    },
  ],
};
