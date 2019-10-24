module.exports = {
    parser: 'babel-eslint',
    extends: [
        'eslint:recommended',

        'plugin:import/errors',
        'plugin:import/warnings',

        'plugin:prettier/recommended',

        'plugin:promise/recommended',

        'plugin:unicorn/recommended'
    ],
    env: {
        browser: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    globals: {
        __VERSION__: true
    },
    rules: {
        'unicorn/prevent-abbreviations': 0,
        'unicorn/no-nested-ternary': 0
    }
};
