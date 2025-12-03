module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],

  rules: {
    'no-unused-vars': 'off',
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
    '@typescript-eslint/no-explicit-any': ['warn'],
    'no-console': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};
